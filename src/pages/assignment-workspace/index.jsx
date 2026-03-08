import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import SecureMonacoEditor from '../../components/SecureEditor/SecureMonacoEditor';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import integrityLogger, { INTEGRITY_EVENTS } from '../../lib/integrity';
import { askGemini } from '../../lib/gemini';

/* ════════════════════════════════════════════════════════════
   Execution Engines
   ════════════════════════════════════════════════════════════ */
const executeJavaScript = (code) => {
  const logs = [];
  const mc = {
    log: (...a) => logs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ')),
    error: (...a) => logs.push('Error: ' + a.map(String).join(' ')),
    warn: (...a) => logs.push('Warning: ' + a.map(String).join(' ')),
    info: (...a) => logs.push(a.map(String).join(' ')),
  };
  try {
    // Sandbox: block access to dangerous globals
    const forbidden = {
      fetch: undefined, XMLHttpRequest: undefined, WebSocket: undefined,
      localStorage: undefined, sessionStorage: undefined, document: undefined,
      window: undefined, globalThis: undefined, eval: undefined,
      Function: undefined, importScripts: undefined,
    };
    const fn = new Function(
      'console', ...Object.keys(forbidden),
      `"use strict";\n${code}`
    );
    fn(mc, ...Object.values(forbidden));
    return { ok: true, out: logs.length ? logs.join('\n') : '(no output)' };
  }
  catch (e) { return { ok: false, out: (logs.length ? logs.join('\n') + '\n' : '') + `Error: ${e.message}` }; }
};

const simulatePython = (code) => {
  const lines = code.split('\n'), outs = [];
  let todo = false;
  for (const l of lines) {
    const t = l.trim();
    if (t.startsWith('# TODO') || t === 'pass') { todo = true; continue; }
    const pm = t.match(/^print\s*\(\s*(['"`])(.*?)\1\s*\)$/);
    if (pm) { outs.push(pm[2]); continue; }
    const pe = t.match(/^print\s*\(\s*(.+?)\s*\)$/);
    if (pe) outs.push(`<${pe[1]}>`);
  }
  if (todo && !outs.length) return { ok: false, out: '⚠ Code has unimplemented sections (TODO / pass).\nComplete the implementation before running.' };
  return { ok: true, out: outs.length ? outs.join('\n') : '(no print output detected)\n\nNote: Python runs in simulation mode.' };
};

const simulateSQL = (code) => {
  const stmts = code.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));
  if (!stmts.length) return { ok: true, out: '(no SQL statements found)' };
  const o = stmts.map((s, i) => {
    const u = s.toUpperCase();
    if (u.startsWith('SELECT')) return `Query ${i + 1}: SELECT → (result set)`;
    if (u.startsWith('CREATE')) return `Statement ${i + 1}: Table created.`;
    if (u.startsWith('INSERT')) return `Statement ${i + 1}: 1 row inserted.`;
    return `Statement ${i + 1}: OK`;
  });
  return { ok: true, out: o.join('\n') };
};

const simulateCpp = (code) => {
  // Simple BST simulation — trace through the main() to produce realistic output
  const lines = code.split('\n');

  // Check if it's the BST code by looking for key patterns
  const hasBST = lines.some(l => l.includes('class BST'));
  const hasMain = lines.some(l => l.trim().startsWith('int main'));
  if (!hasBST || !hasMain) {
    // Generic cout parser for non-BST C++ code
    const outs = [];
    for (const l of lines) {
      const t = l.trim();
      if (!t.startsWith('cout')) continue;
      // extract all << segments
      const parts = t.replace(/^cout/, '').replace(/;\s*$/, '').split('<<').map(p => p.trim());
      for (const p of parts) {
        if (!p) continue;
        const strM = p.match(/^"(.*)"$/);
        if (strM) { outs.push(strM[1].replace(/\\n/g, '\n')); continue; }
        if (p === 'endl') { outs.push('\n'); continue; }
        outs.push(`[${p}]`);
      }
    }
    if (!outs.length) return { ok: true, out: 'C++ simulation: (no cout output detected)\n\nCompile & run with: g++ -o program file.cpp && ./program' };
    return { ok: true, out: outs.join('') };
  }

  // ── BST-specific simulation: actually trace insert/delete/search ──
  class SimNode {
    constructor(d) { this.data = d; this.left = null; this.right = null; }
  }
  const insert = (root, val) => {
    if (!root) return new SimNode(val);
    if (val < root.data) root.left = insert(root.left, val);
    else if (val > root.data) root.right = insert(root.right, val);
    return root;
  };
  const findMin = (node) => { while (node && node.left) node = node.left; return node; };
  const deleteNode = (root, key) => {
    if (!root) return null;
    if (key < root.data) root.left = deleteNode(root.left, key);
    else if (key > root.data) root.right = deleteNode(root.right, key);
    else {
      if (!root.left && !root.right) return null;
      if (!root.left) return root.right;
      if (!root.right) return root.left;
      const t = findMin(root.right);
      root.data = t.data;
      root.right = deleteNode(root.right, t.data);
    }
    return root;
  };
  const search = (root, key) => {
    if (!root) return false;
    if (root.data === key) return true;
    return key < root.data ? search(root.left, key) : search(root.right, key);
  };
  const inorder = (node, res) => { if (!node) return; inorder(node.left, res); res.push(node.data); inorder(node.right, res); };
  const preorder = (node, res) => { if (!node) return; res.push(node.data); preorder(node.left, res); preorder(node.right, res); };
  const postorder = (node, res) => { if (!node) return; postorder(node.left, res); postorder(node.right, res); res.push(node.data); };

  // Parse main() and execute operations
  let root = null, out = [];
  const mainStart = lines.findIndex(l => l.trim().startsWith('int main'));
  if (mainStart < 0) return { ok: true, out: '(could not find main function)' };
  for (let i = mainStart; i < lines.length; i++) {
    const t = lines[i].trim();
    // insert calls: tree.insert(root, 50) or root = tree.insert(root, 50)
    const ins = t.match(/insert\s*\(\s*root\s*,\s*(\d+)\s*\)/);
    if (ins) { root = insert(root, parseInt(ins[1])); continue; }
    // delete calls
    const del = t.match(/deleteNode\s*\(\s*root\s*,\s*(\d+)\s*\)/);
    if (del) { root = deleteNode(root, parseInt(del[1])); continue; }
    // cout lines
    if (t.startsWith('cout')) {
      const parts = t.replace(/^cout/, '').replace(/;\s*$/, '').split('<<').map(p => p.trim());
      for (const p of parts) {
        if (!p) continue;
        const strM = p.match(/^"(.*)"$/);
        if (strM) { out.push(strM[1].replace(/\\n/g, '\n')); continue; }
        if (p === 'endl') { out.push('\n'); continue; }
      }
      continue;
    }
    // traversal calls
    const travIn = t.match(/tree\.inorder\s*\(\s*root\s*\)/);
    if (travIn) { const r = []; inorder(root, r); out.push(r.join(' ')); continue; }
    const travPre = t.match(/tree\.preorder\s*\(\s*root\s*\)/);
    if (travPre) { const r = []; preorder(root, r); out.push(r.join(' ')); continue; }
    const travPost = t.match(/tree\.postorder\s*\(\s*root\s*\)/);
    if (travPost) { const r = []; postorder(root, r); out.push(r.join(' ')); continue; }
    // search cout with ternary
    const srch = t.match(/tree\.search\s*\(\s*root\s*,\s*(\d+)\s*\)\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"/);
    if (srch) { out.push(search(root, parseInt(srch[1])) ? srch[2] : srch[3]); continue; }
  }
  return { ok: true, out: out.length ? out.join('') : '(no output produced)' };
};

const runCode = (lang, code) => {
  if (lang === 'javascript') return executeJavaScript(code);
  if (lang === 'python') return simulatePython(code);
  if (lang === 'cpp') return simulateCpp(code);
  if (lang === 'sql') return simulateSQL(code);
  return { ok: true, out: `(${lang} execution not supported in-browser)` };
};

/* ════════════════════════════════════════════════════════════
   Assignment Data
   ════════════════════════════════════════════════════════════ */
const assignmentBank = {
  a1: {
    title: 'Binary Search Tree – Insert & Delete', subject: 'DSA', language: 'cpp',
    deadline: new Date(Date.now() + 5 * 36e5).toISOString(), maxMarks: 100,
    description: 'Implement insert, delete and search operations for a BST in C++.\n\nYour implementation should support:\n1. Insert a node\n2. Delete a node (leaf, one child, two children)\n3. Search for a value\n4. Inorder, Preorder, Postorder traversal',
    files: {
      'src/bst.cpp': { lang: 'cpp', content: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int val) {
        data = val;
        left = right = NULL;
    }
};

class BST {
public:

    // Insert
    Node* insert(Node* root, int val) {
        if (root == NULL)
            return new Node(val);

        if (val < root->data)
            root->left = insert(root->left, val);
        else if (val > root->data)
            root->right = insert(root->right, val);

        return root;
    }

    // Search
    bool search(Node* root, int key) {
        if (root == NULL)
            return false;

        if (root->data == key)
            return true;

        if (key < root->data)
            return search(root->left, key);

        return search(root->right, key);
    }

    // Find minimum value node
    Node* findMin(Node* root) {
        while (root && root->left != NULL)
            root = root->left;
        return root;
    }

    // Delete
    Node* deleteNode(Node* root, int key) {

        if (root == NULL)
            return root;

        if (key < root->data)
            root->left = deleteNode(root->left, key);

        else if (key > root->data)
            root->right = deleteNode(root->right, key);

        else {

            // Case 1: No child
            if (root->left == NULL && root->right == NULL) {
                delete root;
                return NULL;
            }

            // Case 2: One child
            else if (root->left == NULL) {
                Node* temp = root->right;
                delete root;
                return temp;
            }

            else if (root->right == NULL) {
                Node* temp = root->left;
                delete root;
                return temp;
            }

            // Case 3: Two children
            Node* temp = findMin(root->right);
            root->data = temp->data;
            root->right = deleteNode(root->right, temp->data);
        }

        return root;
    }

    // Inorder Traversal
    void inorder(Node* root) {
        if (root == NULL)
            return;

        inorder(root->left);
        cout << root->data << " ";
        inorder(root->right);
    }

    // Preorder Traversal
    void preorder(Node* root) {
        if (root == NULL)
            return;

        cout << root->data << " ";
        preorder(root->left);
        preorder(root->right);
    }

    // Postorder Traversal
    void postorder(Node* root) {
        if (root == NULL)
            return;

        postorder(root->left);
        postorder(root->right);
        cout << root->data << " ";
    }
};

int main() {

    BST tree;
    Node* root = NULL;

    root = tree.insert(root, 50);
    tree.insert(root, 30);
    tree.insert(root, 70);
    tree.insert(root, 20);
    tree.insert(root, 40);
    tree.insert(root, 60);
    tree.insert(root, 80);

    cout << "Inorder Traversal: ";
    tree.inorder(root);

    cout << "\\nSearching 40: ";
    cout << (tree.search(root, 40) ? "Found" : "Not Found");

    root = tree.deleteNode(root, 20);

    cout << "\\nAfter deleting 20: ";
    tree.inorder(root);

    return 0;
}
` },
      'README.md': { lang: 'markdown', content: `# BST Assignment (C++)

## Objective
Implement a Binary Search Tree with insert, delete, search and traversal in C++.

## Files
- \`src/bst.cpp\` - Complete BST implementation with main()

## Operations
- Insert a node
- Delete a node (handles all 3 cases)
- Search for a value
- Inorder, Preorder, Postorder traversal

## Compile & Run
\`\`\`
g++ -o bst src/bst.cpp
./bst
\`\`\`

## Grading
- Insert: 25 marks
- Delete: 30 marks
- Search: 20 marks
- Traversal: 25 marks
` },
    },
  },
  a2: {
    title: 'Graph Traversal – BFS & DFS', subject: 'DSA', language: 'python',
    deadline: new Date(Date.now() + 26 * 36e5).toISOString(), maxMarks: 150,
    description: 'Implement BFS and DFS on an adjacency list graph.',
    files: {
      'src/graph.py': { lang: 'python', content: '# Graph Traversal\nfrom collections import deque\n\nclass Graph:\n    def __init__(self):\n        self.adj = {}\n\n    def add_edge(self, u, v):\n        # TODO\n        pass\n\n    def bfs(self, start):\n        # TODO\n        pass\n\n    def dfs(self, start):\n        # TODO\n        pass\n' },
      'src/main.py': { lang: 'python', content: '# Driver\nfrom graph import Graph\n\ng = Graph()\ng.add_edge(0, 1)\ng.add_edge(0, 2)\ng.add_edge(1, 3)\n\nprint("BFS:", g.bfs(0))\nprint("DFS:", g.dfs(0))\n' },
      'README.md': { lang: 'markdown', content: '# Graph Traversal\n\nImplement BFS and DFS algorithms.\n' },
    },
  },
  a7: {
    title: 'Normalize to 3NF', subject: 'DBMS', language: 'sql',
    deadline: new Date(Date.now() + 48 * 36e5).toISOString(), maxMarks: 100,
    description: 'Given a denormalized schema, normalize it to Third Normal Form.',
    files: {
      'schema.sql': { lang: 'sql', content: '-- Normalization Exercise\n-- Original: StudentCourseGrade(student_id, name, course_id, course_name, instructor, grade)\n\n-- Step 1: Identify functional dependencies\n-- TODO\n\n-- Step 2: Create 1NF tables\n-- TODO\n\n-- Step 3: Create 2NF tables\n-- TODO\n\n-- Step 4: Create 3NF tables\n-- TODO\n' },
      'queries.sql': { lang: 'sql', content: '-- Verification queries\n-- Write SELECT statements to verify your normalization\n\n-- TODO: Query to join normalized tables\n' },
    },
  },
};

const defaultAssignment = {
  title: 'Assignment', subject: 'General', language: 'python',
  deadline: new Date(Date.now() + 72 * 36e5).toISOString(), maxMarks: 100,
  description: 'Complete the given task.',
  files: { 'main.py': { lang: 'python', content: '# Start coding here\n' } },
};

const langMap = { python: 'python', java: 'java', javascript: 'javascript', sql: 'sql', cpp: 'cpp', markdown: 'markdown' };
const langIcon = { python: 'FileCode', java: 'Coffee', javascript: 'FileJson', sql: 'Database', markdown: 'FileText', cpp: 'FileCode' };
const PASTE_WORD_LIMIT = 5;

/* ════════════════════════════════════════════════════════════
   File Tree Builder
   ════════════════════════════════════════════════════════════ */
const buildTree = (files) => {
  const root = { name: '', children: {}, isDir: true };
  Object.keys(files).forEach(path => {
    const parts = path.split('/');
    let node = root;
    parts.forEach((p, i) => {
      if (i === parts.length - 1) {
        node.children[p] = { name: p, path, isDir: false, lang: files[path].lang };
      } else {
        if (!node.children[p]) node.children[p] = { name: p, children: {}, isDir: true };
        node = node.children[p];
      }
    });
  });
  return root;
};

const FileTreeNode = ({ node, depth = 0, activeFile, onSelect, expanded, onToggle }) => {
  if (node.isDir) {
    const isOpen = expanded[node.name] !== false;
    const kids = Object.values(node.children).sort((a, b) => (b.isDir - a.isDir) || a.name.localeCompare(b.name));
    return (
      <div>
        <button
          onClick={() => onToggle(node.name)}
          className="flex items-center gap-1 w-full px-2 py-[3px] text-[12px] text-[#ccc] hover:bg-[#2a2d2e] transition-colors"
          style={{ paddingLeft: depth * 12 + 8 }}
        >
          <Icon name={isOpen ? 'ChevronDown' : 'ChevronRight'} size={12} className="text-[#888] flex-shrink-0" />
          <Icon name={isOpen ? 'FolderOpen' : 'Folder'} size={13} className="text-[#dcb67a] flex-shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && kids.map(c => (
          <FileTreeNode key={c.name} node={c} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} expanded={expanded} onToggle={onToggle} />
        ))}
      </div>
    );
  }
  const active = activeFile === node.path;
  return (
    <button
      onClick={() => onSelect(node.path)}
      className={`flex items-center gap-1.5 w-full px-2 py-[3px] text-[12px] transition-colors ${active ? 'bg-[#37373d] text-white' : 'text-[#ccc] hover:bg-[#2a2d2e]'}`}
      style={{ paddingLeft: depth * 12 + 8 }}
    >
      <Icon name={langIcon[node.lang] || 'File'} size={13} className={`flex-shrink-0 ${active ? 'text-blue-400' : 'text-[#888]'}`} />
      <span className="truncate">{node.name}</span>
    </button>
  );
};

/* ════════════════════════════════════════════════════════════
   AI Message Renderer — formats markdown-like AI responses
   ════════════════════════════════════════════════════════════ */
const AiMessageRenderer = ({ text }) => {
  if (!text) return null;

  // Split into blocks: code blocks vs regular text
  const blocks = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    blocks.push({ type: 'code', lang: match[1] || '', content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    blocks.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.type === 'code') {
          return (
            <div key={i} className="rounded-lg overflow-hidden border border-[#333]">
              {block.lang && (
                <div className="bg-[#2d2d2d] px-3 py-1 text-[10px] text-[#888] uppercase tracking-wider font-mono border-b border-[#333]">
                  {block.lang}
                </div>
              )}
              <pre className="bg-[#1a1a2e] px-3.5 py-3 overflow-x-auto text-[12px] leading-[1.6] font-mono text-[#d4d4d4]">
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        // Render text with inline formatting
        return <TextBlock key={i} content={block.content} />;
      })}
    </div>
  );
};

const TextBlock = ({ content }) => {
  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());

  return (
    <>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        // Numbered list (1. item)
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(l => l.trim());
          return (
            <ol key={i} className="list-decimal list-outside ml-5 space-y-1.5">
              {items.map((item, j) => (
                <li key={j} className="text-[13px] leading-[1.7] text-[#d4d4d4] pl-1">
                  <InlineFormat text={item.replace(/^\d+\.\s*/, '')} />
                </li>
              ))}
            </ol>
          );
        }

        // Bullet list (- item or * item)
        if (/^[-*]\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(l => l.trim());
          return (
            <ul key={i} className="list-disc list-outside ml-5 space-y-1.5">
              {items.map((item, j) => (
                <li key={j} className="text-[13px] leading-[1.7] text-[#d4d4d4] pl-1">
                  <InlineFormat text={item.replace(/^[-*]\s*/, '')} />
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-[13px] leading-[1.7] text-[#d4d4d4]">
            <InlineFormat text={trimmed} />
          </p>
        );
      })}
    </>
  );
};

const InlineFormat = ({ text }) => {
  // Handle inline code (`code`), bold (**bold**), and italic (*italic*)
  const parts = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIdx = 0;
  let m;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(<span key={lastIdx}>{text.slice(lastIdx, m.index)}</span>);
    }
    const token = m[0];
    if (token.startsWith('`')) {
      parts.push(
        <code key={m.index} className="bg-[#2a2a3a] text-[#9cdcfe] px-1.5 py-0.5 rounded text-[12px] font-mono">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      parts.push(<strong key={m.index} className="text-[#e0e0e0] font-semibold">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      parts.push(<em key={m.index} className="text-[#ccc] italic">{token.slice(1, -1)}</em>);
    }
    lastIdx = m.index + token.length;
  }
  if (lastIdx < text.length) {
    parts.push(<span key={lastIdx}>{text.slice(lastIdx)}</span>);
  }

  return <>{parts}</>;
};

/* ════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════ */
const AssignmentWorkspace = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const assignmentId = params.get('id') || 'a1';
  const asg = assignmentBank[assignmentId] || defaultAssignment;

  // ── File state ──
  const [fileContents, setFileContents] = useState(() => {
    const m = {};
    Object.entries(asg.files).forEach(([p, f]) => { m[p] = f.content; });
    return m;
  });
  const filePaths = Object.keys(asg.files);
  const [activeFile, setActiveFile] = useState(filePaths[0]);
  const [openTabs, setOpenTabs] = useState([filePaths[0]]);
  const [treeExpanded, setTreeExpanded] = useState({ src: true, tests: true });

  // ── Editor state ──
  const [saved, setSaved] = useState(true);
  const [pasteWarnings, setPasteWarnings] = useState([]);
  const [pasteToast, setPasteToast] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);
  const saveTimerRef = useRef(null);

  // ── Sidebar state ──
  const [activeSidebar, setActiveSidebar] = useState('files');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // ── AI Panel (right side) ──
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  // ── Terminal state ──
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: `CodeCampus Terminal — ${asg.subject} / ${asg.language}` },
    { type: 'system', text: `Assignment: ${asg.title}` },
    { type: 'system', text: 'Type "run" to execute, "clear" to clear, "help" for commands.\n' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalTab, setTerminalTab] = useState('terminal');
  const terminalEndRef = useRef(null);
  const terminalInputRef = useRef(null);

  // ── AI Chat state ──
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: `Hi! I'm your AI assistant for "${asg.title}". I can help with hints, debugging, and explaining concepts — but I won't give full solutions. What do you need help with?` },
  ]);
  const [aiInput, setAiInput] = useState('');
  const aiEndRef = useRef(null);

  // ── Derived ──
  const hoursLeft = Math.max(0, (new Date(asg.deadline) - new Date()) / 36e5);
  const deadlineText = hoursLeft < 1 ? `${Math.ceil(hoursLeft * 60)}m` : hoursLeft < 24 ? `${Math.ceil(hoursLeft)}h` : `${Math.ceil(hoursLeft / 24)}d`;
  const deadlineColor = hoursLeft < 6 ? 'text-red-400' : hoursLeft < 24 ? 'text-amber-400' : 'text-[#888]';
  const fileTree = buildTree(asg.files);
  const currentLang = asg.files[activeFile]?.lang || 'python';

  // ── Auto-scroll ──
  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [terminalHistory]);
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  // ── Initialize integrity logger ──
  useEffect(() => {
    integrityLogger.init({
      studentId: 'current_student',
      assignmentId,
      examMode: false,
    });
    return () => integrityLogger.destroy();
  }, [assignmentId]);

  // ── Code change handler ──
  const handleCodeChange = useCallback((value) => {
    setFileContents(prev => ({ ...prev, [activeFile]: value || '' }));
    setSaved(false);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(true), 1500);
  }, [activeFile]);

  // ── Paste detection (handled by SecureMonacoEditor) ──
  const handlePasteDetected = useCallback(({ charCount, wordCount, snippet, blocked }) => {
    setPasteWarnings(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      words: wordCount,
      snippet: snippet || '',
      blocked: !!blocked,
    }]);
    setTerminalHistory(prev => [...prev, {
      type: 'warn',
      text: blocked
        ? `🚫 Paste BLOCKED: ${wordCount} words — pasting is disabled for this assignment.`
        : `⚠ Paste detected: ${wordCount} words — flagged for review.`,
    }]);
  }, []);

  // ── File operations ──
  const openFile = (path) => {
    setActiveFile(path);
    if (!openTabs.includes(path)) setOpenTabs(prev => [...prev, path]);
  };

  const closeTab = (path, e) => {
    e?.stopPropagation();
    const next = openTabs.filter(t => t !== path);
    if (activeFile === path) setActiveFile(next[next.length - 1] || filePaths[0]);
    setOpenTabs(next.length ? next : [filePaths[0]]);
  };

  const toggleTreeDir = (name) => setTreeExpanded(prev => ({ ...prev, [name]: prev[name] === false ? true : false }));

  // ── Search ──
  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const results = [];
    Object.entries(fileContents).forEach(([path, content]) => {
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes(q.toLowerCase())) {
          results.push({ path, line: i + 1, text: line.trim() });
        }
      });
    });
    setSearchResults(results);
  }, [fileContents]);

  // ── Run code ──
  const executeCode = useCallback(() => {
    setIsRunning(true);
    const code = fileContents[activeFile] || '';
    setTerminalHistory(prev => [...prev,
      { type: 'cmd', text: `$ run ${activeFile}` },
      { type: 'system', text: 'Compiling…' },
    ]);
    setTimeout(() => {
      const result = runCode(currentLang, code);
      setIsRunning(false);
      setTerminalHistory(prev => [...prev,
        { type: result.ok ? 'output' : 'error', text: result.out },
        { type: 'system', text: result.ok ? '✓ Process exited with code 0' : '✗ Process exited with code 1' },
        { type: 'system', text: '' },
      ]);
      setTerminalTab('terminal');
      if (!terminalOpen) setTerminalOpen(true);
    }, 800);
  }, [activeFile, fileContents, currentLang, terminalOpen]);

  // ── Terminal commands ──
  const handleTerminalCommand = (cmd) => {
    const t = cmd.trim().toLowerCase();
    setTerminalHistory(prev => [...prev, { type: 'cmd', text: `$ ${cmd}` }]);
    if (t === 'clear') { setTerminalHistory([]); return; }
    if (t === 'run') { executeCode(); return; }
    if (t === 'help') {
      setTerminalHistory(prev => [...prev, { type: 'output', text: 'Available commands:\n  run       Execute current file\n  clear     Clear terminal\n  ls        List files\n  cat <f>   Show file contents\n  help      Show this message' }]);
      return;
    }
    if (t === 'ls') { setTerminalHistory(prev => [...prev, { type: 'output', text: filePaths.join('\n') }]); return; }
    if (t.startsWith('cat ')) {
      const f = cmd.trim().slice(4).trim();
      setTerminalHistory(prev => [...prev, fileContents[f] ? { type: 'output', text: fileContents[f] } : { type: 'error', text: `cat: ${f}: No such file` }]);
      return;
    }
    setTerminalHistory(prev => [...prev, { type: 'error', text: `command not found: ${t.split(' ')[0]}. Type "help" for commands.` }]);
  };

  // ── AI chat ──
  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const userMessage = aiInput.trim();
    setAiMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setAiInput('');
    setAiTyping(true);
    try {
      const response = await askGemini(userMessage, {
        assignmentTitle: asg.title,
        language: currentLang,
        code: fileContents[activeFile] || '',
      }, aiMessages);
      setAiMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setAiTyping(false);
    }
  };

  const handleSubmit = () => {
    // Log submission to integrity system
    integrityLogger.log(INTEGRITY_EVENTS.CODE_SUBMITTED, {
      assignment_id: assignmentId,
      file_count: Object.keys(fileContents).length,
      paste_warnings: pasteWarnings.length,
    });
    const report = integrityLogger.generateReport();
    console.log('Integrity Report:', report);
    setSubmitted(true);
    setShowSubmitConfirm(false);
  };
  const handleEditorMount = (editor) => { editorRef.current = editor; };

  // ── Block paste at document level as safety net ──
  useEffect(() => {
    const blockPaste = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const p = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      const wc = p.trim().split(/\s+/).filter(Boolean).length;
      if (wc > 0) {
        handlePasteDetected({
          charCount: p.length,
          wordCount: wc,
          snippet: p.slice(0, 80),
          blocked: true,
        });
      }
    };
    document.addEventListener('paste', blockPaste, true);
    return () => document.removeEventListener('paste', blockPaste, true);
  }, [handlePasteDetected]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); setSaved(true); }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') { e.preventDefault(); setTerminalOpen(p => !p); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); setActiveSidebar(p => p ? null : 'files'); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ── Terminal resize drag ──
  const startResize = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = terminalHeight;
    const onMove = (ev) => setTerminalHeight(Math.max(100, Math.min(500, startH + (startY - ev.clientY))));
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [terminalHeight]);

  /* ── Submitted screen ── */
  if (submitted) {
    return (
      <>
        <Helmet><title>Submitted – CodeCampus</title></Helmet>
        <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle2" size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-[#e0e0e0] mb-1">Submitted Successfully</h2>
            <p className="text-[13px] text-[#888] mb-1">{asg.title}</p>
            {pasteWarnings.length > 0 && <p className="text-[12px] text-amber-400 mb-3">⚠ {pasteWarnings.length} paste event(s) flagged</p>}
            <Link to="/assignments"><Button size="sm">Back to Assignments</Button></Link>
          </div>
        </div>
      </>
    );
  }

  const sidebarWidth = activeSidebar ? 260 : 0;

  return (
    <>
      <Helmet><title>{asg.title} – CodeCampus</title></Helmet>

      <div className="h-screen flex flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden select-none">

        {/* ════ Title Bar ════ */}
        <div className="h-[30px] bg-[#323233] flex items-center justify-between px-3 flex-shrink-0 border-b border-[#252526]">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/assignments')} className="text-[#999] hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={14} />
            </button>
            <span className="text-[11px] text-[#999]">{asg.title}</span>
            <span className="text-[9px] text-[#666] bg-[#252526] px-1.5 py-0.5 rounded uppercase font-medium">{asg.subject}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-medium ${deadlineColor} flex items-center gap-1`}>
              <Icon name="Clock" size={10} />{deadlineText} left
            </span>
            {pasteWarnings.length > 0 && (
              <span className="text-[10px] text-amber-400 flex items-center gap-1">
                <Icon name="AlertTriangle" size={10} />{pasteWarnings.length}
              </span>
            )}
            <span className="text-[10px] text-[#666] flex items-center gap-1">
              <Icon name={saved ? 'Check' : 'Loader'} size={10} className={saved ? 'text-emerald-400' : 'text-[#888]'} />
              {saved ? 'Saved' : 'Saving…'}
            </span>
          </div>
        </div>

        {/* ════ Main Body ════ */}
        <div className="flex-1 flex min-h-0">

          {/* ──── Activity Bar ──── */}
          <div className="w-[48px] bg-[#333333] flex flex-col items-center py-1 flex-shrink-0 border-r border-[#252526]">
            {[
              { id: 'files', icon: 'Files', tip: 'Explorer (Ctrl+B)' },
              { id: 'search', icon: 'Search', tip: 'Search (Ctrl+Shift+F)' },
            ].map(b => (
              <button key={b.id} title={b.tip}
                onClick={() => setActiveSidebar(activeSidebar === b.id ? null : b.id)}
                className={`w-[48px] h-[48px] flex items-center justify-center transition-colors relative ${
                  activeSidebar === b.id ? 'text-white' : 'text-[#858585] hover:text-white'
                }`}
              >
                {activeSidebar === b.id && <div className="absolute left-0 top-[25%] bottom-[25%] w-[2px] bg-white rounded-r" />}
                <Icon name={b.icon} size={22} />
              </button>
            ))}
            <div className="flex-1" />
            <button title="AI Assistant" onClick={() => setAiPanelOpen(prev => !prev)}
              className={`w-[48px] h-[48px] flex items-center justify-center transition-colors relative ${
                aiPanelOpen ? 'text-indigo-400' : 'text-[#858585] hover:text-white'
              }`}
            >
              {aiPanelOpen && <div className="absolute left-0 top-[25%] bottom-[25%] w-[2px] bg-indigo-400 rounded-r" />}
              <Icon name="Sparkles" size={20} />
            </button>
            <button title="Submit Assignment" onClick={() => setShowSubmitConfirm(true)}
              className="w-[48px] h-[48px] flex items-center justify-center text-[#858585] hover:text-blue-400 transition-colors"
            >
              <Icon name="Send" size={20} />
            </button>
          </div>

          {/* ──── Sidebar Panel ──── */}
          {activeSidebar && (
            <div className="bg-[#252526] border-r border-[#1e1e1e] flex flex-col flex-shrink-0 overflow-hidden" style={{ width: sidebarWidth }}>

              {/* Explorer */}
              {activeSidebar === 'files' && (
                <>
                  <div className="h-[35px] flex items-center justify-between px-4 text-[11px] font-semibold text-[#bbb] uppercase tracking-wider flex-shrink-0">
                    Explorer
                    <button className="text-[#888] hover:text-white"><Icon name="MoreHorizontal" size={14} /></button>
                  </div>
                  <div className="px-2 mb-1">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-[#ccc] uppercase tracking-wider px-2 py-1">
                      <Icon name="ChevronDown" size={12} />
                      {asg.title.length > 25 ? asg.title.slice(0, 25) + '…' : asg.title}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto text-[12px]">
                    {Object.values(fileTree.children).sort((a, b) => (b.isDir - a.isDir) || a.name.localeCompare(b.name)).map(n => (
                      <FileTreeNode key={n.name} node={n} depth={0} activeFile={activeFile} onSelect={openFile} expanded={treeExpanded} onToggle={toggleTreeDir} />
                    ))}
                  </div>
                  {/* Assignment info */}
                  <div className="border-t border-[#1e1e1e] px-3 py-2">
                    <p className="text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-1">Assignment Info</p>
                    <div className="space-y-0.5 text-[11px] text-[#999]">
                      <p><span className="text-[#666]">Subject:</span> {asg.subject}</p>
                      <p><span className="text-[#666]">Marks:</span> {asg.maxMarks}</p>
                      <p><span className="text-[#666]">Language:</span> {asg.language}</p>
                      <p className={deadlineColor}><span className="text-[#666]">Deadline:</span> {deadlineText} left</p>
                    </div>
                  </div>
                </>
              )}

              {/* Search */}
              {activeSidebar === 'search' && (
                <>
                  <div className="h-[35px] flex items-center px-4 text-[11px] font-semibold text-[#bbb] uppercase tracking-wider flex-shrink-0">
                    Search
                  </div>
                  <div className="px-3 mb-2">
                    <div className="relative">
                      <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)}
                        placeholder="Search in files…"
                        className="w-full bg-[#3c3c3c] border border-[#555] text-[12px] text-[#ccc] rounded px-2 py-[5px] focus:outline-none focus:border-[#007acc] placeholder:text-[#888]"
                        autoFocus
                      />
                      {searchQuery && (
                        <button onClick={() => handleSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] hover:text-white">
                          <Icon name="X" size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto text-[12px]">
                    {searchResults.length > 0 ? (
                      <div>
                        <p className="text-[11px] text-[#888] px-3 mb-1">{searchResults.length} result{searchResults.length > 1 ? 's' : ''}</p>
                        {searchResults.map((r, i) => (
                          <button key={i} onClick={() => openFile(r.path)} className="w-full text-left px-3 py-1.5 hover:bg-[#2a2d2e] transition-colors border-b border-[#1e1e1e]">
                            <p className="text-[11px] text-[#ccc] truncate font-mono">{r.text}</p>
                            <p className="text-[10px] text-[#888]">{r.path} : {r.line}</p>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery ? (
                      <p className="text-[11px] text-[#888] px-3">No results found.</p>
                    ) : (
                      <p className="text-[11px] text-[#888] px-3">Type to search across files.</p>
                    )}
                  </div>
                </>
              )}


            </div>
          )}

          {/* ──── Editor + Terminal ──── */}
          <div className="flex-1 flex min-w-0 min-h-0">
          <div className={`flex flex-col min-h-0 ${aiPanelOpen ? 'flex-1 min-w-0' : 'flex-1 min-w-0'}`}>

            {/* Editor Tabs */}
            <div className="h-[35px] bg-[#252526] flex items-end overflow-x-auto flex-shrink-0 border-b border-[#1e1e1e]">
              {openTabs.map(tab => {
                const fname = tab.split('/').pop();
                const isActive = tab === activeFile;
                return (
                  <div key={tab} onClick={() => setActiveFile(tab)}
                    className={`group flex items-center gap-1.5 h-[35px] px-3 text-[12px] cursor-pointer border-r border-[#252526] flex-shrink-0 ${
                      isActive ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-[#999] hover:text-[#ccc]'
                    }`}
                  >
                    <Icon name={langIcon[asg.files[tab]?.lang] || 'File'} size={13} className={isActive ? 'text-blue-400' : 'text-[#888]'} />
                    <span>{fname}</span>
                    {!saved && isActive && <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />}
                    <button onClick={(e) => closeTab(tab, e)} className="ml-1 text-[#888] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Breadcrumbs */}
            <div className="h-[22px] bg-[#1e1e1e] flex items-center px-3 gap-1 text-[11px] text-[#888] flex-shrink-0 border-b border-[#2d2d2d]">
              {activeFile.split('/').map((seg, i, arr) => (
                <React.Fragment key={i}>
                  {i > 0 && <Icon name="ChevronRight" size={10} className="text-[#555]" />}
                  <span className={i === arr.length - 1 ? 'text-[#ccc]' : ''}>{seg}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Secure Monaco Editor — paste blocked */}
            <div className="flex-1 min-h-0">
              <SecureMonacoEditor
                height="100%"
                language={langMap[currentLang] || 'python'}
                value={fileContents[activeFile] || ''}
                onChange={handleCodeChange}
                onMount={handleEditorMount}
                path={activeFile}
                pastePolicy="block"
                onPasteDetected={handlePasteDetected}
                fontSize={14}
                minimap={true}
              />
            </div>

            {/* ──── Terminal Panel ──── */}
            {terminalOpen && (
              <>
                <div onMouseDown={startResize} className="h-[3px] bg-[#252526] cursor-ns-resize hover:bg-[#007acc] transition-colors flex-shrink-0" />

                <div className="flex flex-col flex-shrink-0 bg-[#1e1e1e] border-t border-[#252526]" style={{ height: terminalHeight }}>
                  {/* Terminal header */}
                  <div className="h-[30px] bg-[#252526] flex items-center justify-between px-2 flex-shrink-0">
                    <div className="flex items-center">
                      {[
                        { id: 'terminal', label: 'Terminal', icon: 'TerminalSquare' },
                        { id: 'problems', label: `Problems${pasteWarnings.length ? ` (${pasteWarnings.length})` : ''}`, icon: 'AlertCircle' },
                        { id: 'output', label: 'Output', icon: 'FileOutput' },
                      ].map(t => (
                        <button key={t.id} onClick={() => setTerminalTab(t.id)}
                          className={`flex items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                            terminalTab === t.id ? 'text-white border-b border-white' : 'text-[#888] hover:text-[#ccc]'
                          }`}
                        >
                          <Icon name={t.icon} size={12} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={executeCode} disabled={isRunning} title="Run"
                        className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-medium rounded hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <Icon name={isRunning ? 'Loader' : 'Play'} size={11} className={isRunning ? 'animate-spin' : ''} />
                        {isRunning ? 'Running' : 'Run'}
                      </button>
                      <button onClick={() => setTerminalOpen(false)} className="text-[#888] hover:text-white p-1">
                        <Icon name="X" size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Terminal body */}
                  <div className="flex-1 overflow-y-auto font-mono text-[12px] leading-[1.6] px-3 py-1" onClick={() => terminalInputRef.current?.focus()}>
                    {terminalTab === 'terminal' && (
                      <>
                        {terminalHistory.map((entry, i) => (
                          <div key={i} className={
                            entry.type === 'cmd' ? 'text-[#569cd6]' :
                            entry.type === 'error' ? 'text-red-400' :
                            entry.type === 'warn' ? 'text-amber-400' :
                            entry.type === 'output' ? 'text-[#d4d4d4]' :
                            'text-[#888]'
                          }>
                            <pre className="whitespace-pre-wrap">{entry.text}</pre>
                          </div>
                        ))}
                        <div ref={terminalEndRef} />
                        <div className="flex items-center">
                          <span className="text-emerald-400 mr-1">$</span>
                          <input ref={terminalInputRef} type="text" value={terminalInput}
                            onChange={e => setTerminalInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && terminalInput.trim()) {
                                handleTerminalCommand(terminalInput);
                                setTerminalInput('');
                              }
                            }}
                            className="flex-1 bg-transparent text-[#d4d4d4] focus:outline-none caret-white"
                            spellCheck={false}
                          />
                        </div>
                      </>
                    )}
                    {terminalTab === 'problems' && (
                      <div className="py-2 text-[#888]">
                        {pasteWarnings.length > 0 ? (
                          pasteWarnings.map((w, i) => (
                            <div key={i} className="flex items-start gap-2 py-0.5 text-amber-400">
                              <Icon name="AlertTriangle" size={12} className="mt-0.5 flex-shrink-0" />
                              <span>Paste flagged: {w.words} words at {w.time} — "{w.snippet}…"</span>
                            </div>
                          ))
                        ) : <p>No problems detected.</p>}
                      </div>
                    )}
                    {terminalTab === 'output' && (
                      <div className="py-2 text-[#888]"><p>Run your code to see output here.</p></div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ──── AI Chat Panel (Right Side) ──── */}
          {aiPanelOpen && (
            <div className="w-[380px] flex-shrink-0 bg-[#1e1e1e] border-l border-[#333] flex flex-col min-h-0">
              {/* Header */}
              <div className="h-[35px] flex items-center justify-between px-4 bg-[#252526] border-b border-[#333] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Icon name="Sparkles" size={14} className="text-indigo-400" />
                  <span className="text-[12px] font-semibold text-[#e0e0e0]">AI Assistant</span>
                </div>
                <button onClick={() => setAiPanelOpen(false)} className="text-[#888] hover:text-white transition-colors">
                  <Icon name="X" size={14} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {aiMessages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                    {m.role === 'user' ? (
                      <div className="max-w-[85%] bg-[#264f78] text-[#e8e8e8] px-3.5 py-2.5 rounded-xl rounded-br-sm text-[13px] leading-relaxed font-[system-ui]">
                        {m.text}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon name="Sparkles" size={12} className="text-indigo-400" />
                          <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">AI</span>
                        </div>
                        <div className="ai-message-content text-[13px] leading-[1.7] text-[#d4d4d4] font-[system-ui]">
                          <AiMessageRenderer text={m.text} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex items-center gap-2 text-[12px] text-[#888]">
                    <Icon name="Sparkles" size={12} className="text-indigo-400 animate-pulse" />
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                )}
                <div ref={aiEndRef} />
              </div>

              {/* Quick actions + Input */}
              <div className="p-3 border-t border-[#333] bg-[#252526]">
                <div className="flex gap-1.5 mb-2.5">
                  {['Hint', 'Debug', 'Explain', 'Optimize'].map(q => (
                    <button key={q}
                      onClick={() => { setAiInput(`Can you ${q.toLowerCase()} this?`); }}
                      className="px-2.5 py-1 bg-[#333] text-[11px] text-[#ccc] rounded-md border border-[#444] hover:border-indigo-500/50 hover:text-indigo-300 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !aiTyping && sendAiMessage()}
                    placeholder="Ask about your code…"
                    disabled={aiTyping}
                    className="flex-1 bg-[#3c3c3c] border border-[#555] text-[13px] text-[#e0e0e0] rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-[#666] disabled:opacity-50 font-[system-ui]"
                  />
                  <button onClick={sendAiMessage} disabled={aiTyping || !aiInput.trim()}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icon name="SendHorizontal" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* ════ Status Bar ════ */}
        <div className="h-[22px] bg-[#007acc] flex items-center justify-between px-2 flex-shrink-0 text-[11px] text-white/90">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Icon name="GitBranch" size={12} />main</span>
            {pasteWarnings.length > 0 && (
              <span className="flex items-center gap-1"><Icon name="AlertTriangle" size={11} />{pasteWarnings.length}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span>{currentLang.toUpperCase()}</span>
            <span>UTF-8</span>
            <button onClick={() => { if (!terminalOpen) setTerminalOpen(true); }}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Icon name="TerminalSquare" size={12} /> Terminal
            </button>
            <button onClick={() => setShowSubmitConfirm(true)}
              className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded hover:bg-white/30 transition-colors"
            >
              <Icon name="Send" size={11} /> Submit
            </button>
          </div>
        </div>
      </div>

      {/* ════ Submit Modal ════ */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#252526] rounded-lg p-6 w-full max-w-sm mx-4 border border-[#3c3c3c]" style={{ boxShadow: '0 8px 30px rgba(0,0,0,.4)' }}>
            <h3 className="text-[16px] font-semibold text-[#e0e0e0] mb-2">Submit Assignment?</h3>
            <p className="text-[13px] text-[#999] mb-1">Submitting <span className="text-[#ccc] font-medium">{asg.title}</span></p>
            <p className="text-[12px] text-[#888] mb-1">{Object.keys(fileContents).length} file(s) will be submitted.</p>
            {pasteWarnings.length > 0 && (
              <p className="text-[12px] text-amber-400 mb-3 flex items-center gap-1">
                <Icon name="AlertTriangle" size={12} />
                {pasteWarnings.length} paste event(s) flagged for instructor review.
              </p>
            )}
            <p className="text-[11px] text-[#666] mb-4">This cannot be undone after the deadline.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowSubmitConfirm(false)} className="px-3 py-[6px] bg-[#3c3c3c] text-[#ccc] text-[12px] font-medium rounded hover:bg-[#505050] transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-3 py-[6px] bg-[#007acc] text-white text-[12px] font-medium rounded hover:bg-[#1b8ad3] transition-colors">Confirm Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentWorkspace;
