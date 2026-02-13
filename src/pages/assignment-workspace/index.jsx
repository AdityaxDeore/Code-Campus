import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

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
    // Restrict access to dangerous globals for sandboxed execution
    const forbidden = {
      fetch: undefined, XMLHttpRequest: undefined, WebSocket: undefined,
      eval: undefined, localStorage: undefined, sessionStorage: undefined,
      document: undefined, indexedDB: undefined, importScripts: undefined,
    };
    new Function('console', ...Object.keys(forbidden), code)(mc, ...Object.values(forbidden));
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

const runCode = (lang, code) => {
  if (lang === 'javascript') return executeJavaScript(code);
  if (lang === 'python') return simulatePython(code);
  if (lang === 'sql') return simulateSQL(code);
  return { ok: true, out: `(${lang} execution not supported in-browser)` };
};

/* ════════════════════════════════════════════════════════════
   Assignment Data
   ════════════════════════════════════════════════════════════ */
const assignmentBank = {
  a1: {
    title: 'Binary Search Tree – Insert & Delete', subject: 'DSA', language: 'python',
    deadline: new Date(Date.now() + 5 * 36e5).toISOString(), maxMarks: 100,
    description: 'Implement insert, delete and search operations for a BST.\n\nYour implementation should support:\n1. Insert a node\n2. Delete a node\n3. Search for a value\n4. In-order traversal',
    files: {
      'src/bst.py': { lang: 'python', content: '# Binary Search Tree Implementation\n\nclass Node:\n    def __init__(self, key):\n        self.left = None\n        self.right = None\n        self.val = key\n\n\nclass BST:\n    def __init__(self):\n        self.root = None\n\n    def insert(self, key):\n        # TODO: implement\n        pass\n\n    def delete(self, key):\n        # TODO: implement\n        pass\n\n    def search(self, key):\n        # TODO: implement\n        pass\n\n    def inorder(self):\n        # TODO: implement\n        pass\n' },
      'src/main.py': { lang: 'python', content: '# Main entry point\nfrom bst import BST\n\ntree = BST()\ntree.insert(50)\ntree.insert(30)\ntree.insert(70)\ntree.insert(20)\n\nprint("In-order traversal:")\ntree.inorder()\n\nprint("Search 30:", tree.search(30))\n' },
      'tests/test_bst.py': { lang: 'python', content: '# Test cases for BST\nimport unittest\nfrom src.bst import BST\n\nclass TestBST(unittest.TestCase):\n    def setUp(self):\n        self.bst = BST()\n\n    def test_insert(self):\n        self.bst.insert(10)\n        self.assertIsNotNone(self.bst.root)\n\n    def test_search_found(self):\n        self.bst.insert(10)\n        self.assertTrue(self.bst.search(10))\n\n    def test_search_not_found(self):\n        self.assertFalse(self.bst.search(99))\n\nif __name__ == "__main__":\n    unittest.main()\n' },
      'README.md': { lang: 'markdown', content: '# BST Assignment\n\n## Objective\nImplement a Binary Search Tree with insert, delete, search and traversal.\n\n## Files\n- `src/bst.py` - Main BST implementation\n- `src/main.py` - Driver code\n- `tests/test_bst.py` - Unit tests\n\n## Grading\n- Insert: 25 marks\n- Delete: 30 marks\n- Search: 20 marks\n- Traversal: 25 marks\n' },
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
const PASTE_WORD_LIMIT = 10;

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
   AI Chat
   ════════════════════════════════════════════════════════════ */
const aiResponses = [
  "Let me help you think through this. What specific part are you stuck on?",
  "Good question! Try breaking the problem into smaller steps. What's the first operation you need?",
  "Think about the data structure's invariants. What property must always hold after your operation?",
  "Consider using recursion. What's your base case? What's your recursive case?",
  "Try tracing through a small example on paper first. What happens step by step?",
  "That's a common approach! Have you considered edge cases — empty input or single element?",
  "Look at the time complexity. Can you do better? What data structure gives faster lookups?",
  "I can't give the full solution, but I can help debug. What output do you get vs. expect?",
];

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
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);
  const saveTimerRef = useRef(null);

  // ── Sidebar state ──
  const [activeSidebar, setActiveSidebar] = useState('files');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  // ── Code change handler ──
  const handleCodeChange = useCallback((value) => {
    setFileContents(prev => ({ ...prev, [activeFile]: value || '' }));
    setSaved(false);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(true), 1500);
  }, [activeFile]);

  // ── Paste detection ──
  useEffect(() => {
    const h = (e) => {
      const p = (e.clipboardData || window.clipboardData).getData('text');
      const wc = p.trim().split(/\s+/).filter(Boolean).length;
      if (wc > PASTE_WORD_LIMIT) {
        setPasteWarnings(prev => [...prev, { time: new Date().toLocaleTimeString(), words: wc, snippet: p.slice(0, 60) }]);
        setTerminalHistory(prev => [...prev, { type: 'warn', text: `⚠ Paste detected: ${wc} words — flagged for review.` }]);
      }
    };
    window.addEventListener('paste', h);
    return () => window.removeEventListener('paste', h);
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
  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    setAiMessages(prev => [...prev, { role: 'user', text: aiInput.trim() }]);
    setAiInput('');
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'ai', text: aiResponses[Math.floor(Math.random() * aiResponses.length)] }]);
    }, 600 + Math.random() * 800);
  };

  const handleSubmit = () => { setSubmitted(true); setShowSubmitConfirm(false); };
  const handleEditorMount = (editor) => { editorRef.current = editor; };

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
              { id: 'ai', icon: 'Sparkles', tip: 'AI Assistant' },
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

              {/* AI Assistant */}
              {activeSidebar === 'ai' && (
                <>
                  <div className="h-[35px] flex items-center px-4 text-[11px] font-semibold text-[#bbb] uppercase tracking-wider flex-shrink-0 gap-1.5">
                    <Icon name="Sparkles" size={13} className="text-indigo-400" />
                    AI Assistant
                  </div>
                  <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-2">
                    {aiMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] px-3 py-2 rounded-lg text-[12px] leading-relaxed ${
                          m.role === 'user' ? 'bg-[#264f78] text-[#e0e0e0]' : 'bg-[#333] text-[#ccc]'
                        }`}>
                          {m.role === 'ai' && <Icon name="Sparkles" size={11} className="text-indigo-400 inline mr-1 -mt-0.5" />}
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div ref={aiEndRef} />
                  </div>
                  <div className="p-3 border-t border-[#1e1e1e]">
                    <div className="flex gap-1.5 mb-2">
                      {['Hint', 'Debug', 'Explain'].map(q => (
                        <button key={q}
                          onClick={() => { setAiInput(`Can you ${q.toLowerCase()} this?`); }}
                          className="px-2 py-1 bg-[#333] text-[10px] text-[#ccc] rounded border border-[#555] hover:border-[#888] transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendAiMessage()}
                        placeholder="Ask about your code…"
                        className="flex-1 bg-[#3c3c3c] border border-[#555] text-[12px] text-[#ccc] rounded px-2 py-[5px] focus:outline-none focus:border-[#007acc] placeholder:text-[#666]"
                      />
                      <button onClick={sendAiMessage} className="px-2 py-1 bg-[#007acc] text-white rounded hover:bg-[#1b8ad3] transition-colors">
                        <Icon name="SendHorizontal" size={13} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ──── Editor + Terminal ──── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">

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

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={langMap[currentLang] || 'python'}
                value={fileContents[activeFile] || ''}
                onChange={handleCodeChange}
                onMount={handleEditorMount}
                theme="vs-dark"
                path={activeFile}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                  minimap: { enabled: true, maxColumn: 80, scale: 1 },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 4,
                  automaticLayout: true,
                  padding: { top: 8, bottom: 8 },
                  renderLineHighlight: 'all',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  bracketPairColorization: { enabled: true },
                  guides: { indentation: true, bracketPairs: true },
                }}
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
