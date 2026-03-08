/**
 * ════════════════════════════════════════════════════════════════
 *  Teacher Review Interface
 * ════════════════════════════════════════════════════════════════
 *
 *  Allows teachers to:
 *    - View student code submissions (read-only Monaco)
 *    - View uploaded documents
 *    - See integrity report & AI usage logs
 *    - Inline grading with rubric scoring
 *    - Add comments on specific lines
 *    - View integrity timeline
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import IntegrityReport from '../../components/IntegrityReport';

/* ════════════════════════════════════════════════════════════
   Mock Data
   ════════════════════════════════════════════════════════════ */

const MOCK_SUBMISSIONS = {
  sub_1: {
    id: 'sub_1',
    studentId: 'student_001',
    studentName: 'Aditya Deore',
    studentEmail: 'aditya@codecampus.edu',
    prn: '124B1F116',
    assignmentId: 'a1',
    assignmentTitle: 'Binary Search Tree – Insert & Delete',
    subject: 'DSA',
    language: 'cpp',
    maxMarks: 100,
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'submitted',
    files: {
      'src/bst.cpp': {
        lang: 'cpp',
        content: `#include <iostream>
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
`,
      },
      'README.md': {
        lang: 'markdown',
        content: `# BST Assignment (C++)

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
`,
      },
    },
    documents: [],
    rubric: [
      { criterion: 'Insert Implementation', maxScore: 25, score: null, comment: '' },
      { criterion: 'Delete Implementation', maxScore: 30, score: null, comment: '' },
      { criterion: 'Search Implementation', maxScore: 20, score: null, comment: '' },
      { criterion: 'Traversal', maxScore: 25, score: null, comment: '' },
    ],
    integrityReport: {
      sessionId: 'session_aditya_001',
      studentId: 'student_001',
      assignmentId: 'a1',
      examMode: true,
      generatedAt: new Date().toISOString(),
      summary: {
        totalEvents: 20,
        pasteEventsCount: 5,
        blockedPastesCount: 1,
        suspectedPasteFlags: 3,
        aiUsageCount: 2,
        aiRequestCount: 3,
        focusLossEvents: 2,
        tabSwitchEvents: 4,
        criticalEventsCount: 0,
        internalClipboardUsage: 2,
        typingPattern: {
          averageInterval: 195,
          stdDeviation: 110,
          minInterval: 22,
          maxInterval: 6200,
          sampleSize: 312,
        },
      },
      flags: {
        highPasteActivity: true,
        excessiveFocusLoss: false,
        suspiciousAiUsage: false,
        rapidFocusSwitching: false,
        devtoolsDetected: false,
        typingAnomalies: false,
      },
      events: [
        { id: 'evt_1', eventType: 'exam_started', severity: 'info', timestamp: new Date(Date.now() - 3600000).toISOString(), metadata: { examMode: true } },
        { id: 'evt_2', eventType: 'paste_detected', severity: 'warning', timestamp: new Date(Date.now() - 3200000).toISOString(), metadata: { charCount: 52, source: 'external', content: 'struct Node { int data; Node* left; Node* right;...' } },
        { id: 'evt_3', eventType: 'tab_switch', severity: 'warning', timestamp: new Date(Date.now() - 2900000).toISOString(), metadata: { toTab: 'Stack Overflow' } },
        { id: 'evt_4', eventType: 'focus_lost', severity: 'warning', timestamp: new Date(Date.now() - 2900000).toISOString(), metadata: { duration: 8500 } },
        { id: 'evt_5', eventType: 'focus_regained', severity: 'info', timestamp: new Date(Date.now() - 2891500).toISOString(), metadata: {} },
        { id: 'evt_6', eventType: 'paste_detected', severity: 'warning', timestamp: new Date(Date.now() - 2600000).toISOString(), metadata: { charCount: 78, source: 'external', content: 'Node* insert(Node* root, int key) { if (!root)...' } },
        { id: 'evt_7', eventType: 'paste_detected', severity: 'warning', timestamp: new Date(Date.now() - 2200000).toISOString(), metadata: { charCount: 95, source: 'external', content: 'Node* deleteNode(Node* root, int key) { if (!root)...' } },
        { id: 'evt_8', eventType: 'tab_switch', severity: 'warning', timestamp: new Date(Date.now() - 1900000).toISOString(), metadata: { toTab: 'GeeksforGeeks' } },
        { id: 'evt_9', eventType: 'focus_lost', severity: 'warning', timestamp: new Date(Date.now() - 1900000).toISOString(), metadata: { duration: 6200 } },
        { id: 'evt_10', eventType: 'focus_regained', severity: 'info', timestamp: new Date(Date.now() - 1893800).toISOString(), metadata: {} },
        { id: 'evt_11', eventType: 'paste_detected', severity: 'warning', timestamp: new Date(Date.now() - 1600000).toISOString(), metadata: { charCount: 34, source: 'internal', content: 'cout << root->data << " ";' } },
        { id: 'evt_12', eventType: 'ai_suggestion_requested', severity: 'info', timestamp: new Date(Date.now() - 1300000).toISOString(), metadata: { prompt: 'How to implement inorder traversal in C++' } },
        { id: 'evt_13', eventType: 'ai_suggestion_used', severity: 'warning', timestamp: new Date(Date.now() - 1250000).toISOString(), metadata: { charCount: 42 } },
        { id: 'evt_14', eventType: 'ai_suggestion_requested', severity: 'info', timestamp: new Date(Date.now() - 1050000).toISOString(), metadata: { prompt: 'findMin helper for BST delete' } },
        { id: 'evt_15', eventType: 'ai_suggestion_used', severity: 'warning', timestamp: new Date(Date.now() - 1020000).toISOString(), metadata: { charCount: 35 } },
        { id: 'evt_16', eventType: 'tab_switch', severity: 'warning', timestamp: new Date(Date.now() - 1000000).toISOString(), metadata: { toTab: 'cppreference.com' } },
        { id: 'evt_17', eventType: 'tab_switch', severity: 'warning', timestamp: new Date(Date.now() - 800000).toISOString(), metadata: { toTab: 'CodeCampus Editor' } },
        { id: 'evt_18', eventType: 'paste_detected', severity: 'warning', timestamp: new Date(Date.now() - 700000).toISOString(), metadata: { charCount: 61, source: 'external', content: 'void preorder(Node* root) { if (root) { cout...' } },
        { id: 'evt_19', eventType: 'code_submitted', severity: 'info', timestamp: new Date(Date.now() - 600000).toISOString(), metadata: {} },
        { id: 'evt_20', eventType: 'exam_ended', severity: 'info', timestamp: new Date(Date.now() - 300000).toISOString(), metadata: { total_violations: 5 } },
      ],
    },
    lineComments: {},
  },
};

// Try loading a report submission from sessionStorage (set by report-submission page)
function loadReportSubmission(assignmentId) {
  try {
    const raw = sessionStorage.getItem(`report_submission_${assignmentId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const MOCK_SUBMISSION_LIST = [
  { id: 'sub_1', studentName: 'Aditya Deore', prn: '124B1F116', status: 'submitted', submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(), score: null },
  { id: 'sub_2', studentName: 'Chinmay Ahire', prn: '125B2F001', status: 'submitted', submittedAt: new Date(Date.now() - 4 * 3600000).toISOString(), score: null },
  { id: 'sub_3', studentName: 'Aditya Gurav', prn: '124B1F124', status: 'submitted', submittedAt: new Date(Date.now() - 6 * 3600000).toISOString(), score: null },
  { id: 'sub_4', studentName: 'Ved Jadhav', prn: '124B1F059', status: 'submitted', submittedAt: new Date(Date.now() - 8 * 3600000).toISOString(), score: null },
  { id: 'sub_5', studentName: 'Veerbhadra Manhat', prn: '124B1F098', status: 'submitted', submittedAt: new Date(Date.now() - 10 * 3600000).toISOString(), score: null },
  { id: 'sub_6', studentName: 'Sharvil Patil', prn: '124B1F102', status: 'submitted', submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(), score: null },
];

/* ════════════════════════════════════════════════════════════
   C++ BST Simulator (browser-side)
   ════════════════════════════════════════════════════════════ */
const simulateCpp = (code) => {
  const lines = code.split('\n');
  const hasBST = lines.some(l => l.includes('class BST'));
  const hasMain = lines.some(l => l.trim().startsWith('int main'));
  if (!hasBST || !hasMain) {
    const outs = [];
    for (const l of lines) {
      const t = l.trim();
      if (!t.startsWith('cout')) continue;
      const parts = t.replace(/^cout/, '').replace(/;\s*$/, '').split('<<').map(p => p.trim());
      for (const p of parts) {
        if (!p) continue;
        const strM = p.match(/^"(.*)"$/);
        if (strM) { outs.push(strM[1].replace(/\\n/g, '\n')); continue; }
        if (p === 'endl') { outs.push('\n'); continue; }
        outs.push(`[${p}]`);
      }
    }
    if (!outs.length) return { ok: true, out: 'C++ simulation: (no cout output detected)' };
    return { ok: true, out: outs.join('') };
  }
  class SimNode { constructor(d) { this.data = d; this.left = null; this.right = null; } }
  const insert = (root, val) => { if (!root) return new SimNode(val); if (val < root.data) root.left = insert(root.left, val); else if (val > root.data) root.right = insert(root.right, val); return root; };
  const findMin = (node) => { while (node && node.left) node = node.left; return node; };
  const deleteNode = (root, key) => { if (!root) return null; if (key < root.data) root.left = deleteNode(root.left, key); else if (key > root.data) root.right = deleteNode(root.right, key); else { if (!root.left && !root.right) return null; if (!root.left) return root.right; if (!root.right) return root.left; const t = findMin(root.right); root.data = t.data; root.right = deleteNode(root.right, t.data); } return root; };
  const search = (root, key) => { if (!root) return false; if (root.data === key) return true; return key < root.data ? search(root.left, key) : search(root.right, key); };
  const inorder = (node, res) => { if (!node) return; inorder(node.left, res); res.push(node.data); inorder(node.right, res); };
  const preorder = (node, res) => { if (!node) return; res.push(node.data); preorder(node.left, res); preorder(node.right, res); };
  const postorder = (node, res) => { if (!node) return; postorder(node.left, res); postorder(node.right, res); res.push(node.data); };

  let root = null, out = [];
  const mainStart = lines.findIndex(l => l.trim().startsWith('int main'));
  if (mainStart < 0) return { ok: true, out: '(could not find main function)' };
  for (let i = mainStart; i < lines.length; i++) {
    const t = lines[i].trim();
    const ins = t.match(/insert\s*\(\s*root\s*,\s*(\d+)\s*\)/);
    if (ins) { root = insert(root, parseInt(ins[1])); continue; }
    const del = t.match(/deleteNode\s*\(\s*root\s*,\s*(\d+)\s*\)/);
    if (del) { root = deleteNode(root, parseInt(del[1])); continue; }
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
    const travIn = t.match(/tree\.inorder\s*\(\s*root\s*\)/);
    if (travIn) { const r = []; inorder(root, r); out.push(r.join(' ')); continue; }
    const travPre = t.match(/tree\.preorder\s*\(\s*root\s*\)/);
    if (travPre) { const r = []; preorder(root, r); out.push(r.join(' ')); continue; }
    const travPost = t.match(/tree\.postorder\s*\(\s*root\s*\)/);
    if (travPost) { const r = []; postorder(root, r); out.push(r.join(' ')); continue; }
    const srch = t.match(/tree\.search\s*\(\s*root\s*,\s*(\d+)\s*\)\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"/);
    if (srch) { out.push(search(root, parseInt(srch[1])) ? srch[2] : srch[3]); continue; }
  }
  return { ok: true, out: out.length ? out.join('') : '(no output produced)' };
};

/* ════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════ */

const TeacherReview = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialId = params.get('id') || null;

  // ── View mode: null = student list, string = detail review ──
  const [selectedId, setSelectedId] = useState(initialId);

  // ── State ──
  const submission = MOCK_SUBMISSIONS[selectedId] || MOCK_SUBMISSIONS.sub_1;
  const [activeFile, setActiveFile] = useState(Object.keys(MOCK_SUBMISSIONS.sub_1.files)[0]);
  const [activePanel, setActivePanel] = useState('code'); // code | integrity | documents
  const [rubricScores, setRubricScores] = useState(MOCK_SUBMISSIONS.sub_1.rubric.map(r => ({ ...r })));
  const [lineComments, setLineComments] = useState({});
  const [overallFeedback, setOverallFeedback] = useState('');
  const [codeOutput, setCodeOutput] = useState(null); // { ok, out }
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  // ── Computed ──
  const totalScore = useMemo(
    () => rubricScores.reduce((sum, r) => sum + (parseInt(r.score) || 0), 0),
    [rubricScores]
  );
  const totalMax = useMemo(
    () => rubricScores.reduce((sum, r) => sum + r.maxScore, 0),
    [rubricScores]
  );
  const allScored = rubricScores.every(r => r.score !== null && r.score !== '');

  // ── Rubric handlers ──
  const updateRubricScore = (index, score) => {
    setRubricScores(prev => prev.map((r, i) =>
      i === index ? { ...r, score: Math.min(parseInt(score) || 0, r.maxScore) } : r
    ));
  };

  const updateRubricComment = (index, comment) => {
    setRubricScores(prev => prev.map((r, i) =>
      i === index ? { ...r, comment } : r
    ));
  };

  // ── Line comment handler ──
  const addLineComment = useCallback((file, line, comment) => {
    setLineComments(prev => ({
      ...prev,
      [`${file}:${line}`]: comment,
    }));
  }, []);

  // ── Submit grade ──
  const handleSubmitGrade = () => {
    const grade = {
      submissionId: submission.id,
      rubricScores,
      totalScore,
      totalMax: submission.maxMarks,
      overallFeedback,
      lineComments,
      gradedAt: new Date().toISOString(),
      gradedBy: 'current_teacher',
    };
    console.log('Grade submitted:', grade);
    alert(`Grade submitted: ${totalScore}/${submission.maxMarks}`);
  };

  // ── Open a student from the list ──
  const openStudent = (id) => {
    setSelectedId(id);
    const sub = MOCK_SUBMISSIONS[id] || MOCK_SUBMISSIONS.sub_1;
    setActiveFile(Object.keys(sub.files)[0]);
    setActivePanel('code');
    setRubricScores(sub.rubric.map(r => ({ ...r })));
    setLineComments({});
    setOverallFeedback('');
    setCodeOutput(null);
    setShowOutput(false);
  };

  // ── Run code (teacher can execute just like student) ──
  const executeCode = useCallback(() => {
    const code = submission.files[activeFile]?.content || '';
    const lang = submission.files[activeFile]?.lang || 'cpp';
    setIsRunning(true);
    setShowOutput(true);
    setTimeout(() => {
      try {
        let output = '';
        if (lang === 'cpp' || lang === 'c') {
          output = simulateCpp(code);
        } else if (lang === 'javascript' || lang === 'js') {
          output = '// JavaScript execution not available in teacher view';
        } else {
          output = `// No simulator available for language: ${lang}`;
        }
        setCodeOutput({ ok: true, out: output });
      } catch (err) {
        setCodeOutput({ ok: false, out: `Error: ${err.message}` });
      }
      setIsRunning(false);
    }, 600);
  }, [submission, activeFile]);

  const currentLang = submission.files[activeFile]?.lang || 'python';

  /* ════════════════════════════════════════════════════════════
     STUDENT LIST VIEW
     ════════════════════════════════════════════════════════════ */
  if (!selectedId) {
    return (
      <>
        <Helmet><title>Teacher Dashboard – CodeCampus</title></Helmet>
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#151525] to-[#0f0f1a] text-[#cccccc]">
          {/* Header */}
          <div className="border-b border-[#2e2e4e] bg-[#1a1a2e]/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/student-dashboard')} className="text-[#888] hover:text-white transition-colors">
                  <Icon name="ArrowLeft" size={18} />
                </button>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Icon name="GraduationCap" size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-[16px] font-bold text-white tracking-tight">Teacher Dashboard</h1>
                  <p className="text-[11px] text-[#888]">Student Submissions • DSA Assignment</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#888]">
                  <span className="text-indigo-400 font-semibold">{MOCK_SUBMISSION_LIST.length}</span> submissions
                </span>
              </div>
            </div>
          </div>

          {/* Student Cards */}
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid gap-3">
              {MOCK_SUBMISSION_LIST.map((s, idx) => {
                const initials = s.studentName.split(' ').map(n => n[0]).join('').slice(0, 2);
                const colors = [
                  'from-indigo-500 to-blue-600',
                  'from-emerald-500 to-teal-600',
                  'from-amber-500 to-orange-600',
                  'from-rose-500 to-pink-600',
                  'from-violet-500 to-purple-600',
                  'from-cyan-500 to-sky-600',
                ];
                const grad = colors[idx % colors.length];
                return (
                  <button
                    key={s.id}
                    onClick={() => openStudent(s.id)}
                    className="group flex items-center gap-4 bg-[#1a1a2e] hover:bg-[#222240] border border-[#2e2e4e] hover:border-indigo-500/40 rounded-xl px-5 py-4 transition-all text-left"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-[14px] font-bold text-white shrink-0 shadow-lg`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {s.studentName}
                      </p>
                      <p className="text-[12px] text-[#888] font-mono mt-0.5">PRN: {s.prn}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-amber-500/15 text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Pending Review
                      </span>
                      <p className="text-[10px] text-[#666] mt-1.5">
                        {new Date(s.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-[#555] group-hover:text-indigo-400 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ════════════════════════════════════════════════════════════
     DETAIL REVIEW VIEW (existing layout)
     ════════════════════════════════════════════════════════════ */
  return (
    <>
      <Helmet><title>Review: {submission.studentName} – CodeCampus</title></Helmet>

      <div className="h-screen flex flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden">
        {/* ════ Title Bar ════ */}
        <div className="h-[36px] bg-[#323233] flex items-center justify-between px-4 flex-shrink-0 border-b border-[#252526]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedId(null)} className="text-[#999] hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={16} />
            </button>
            <div className="flex items-center gap-2">
              <Icon name="GraduationCap" size={16} className="text-blue-400" />
              <span className="text-[12px] text-[#e0e0e0] font-medium">Review:</span>
              <span className="text-[12px] text-white">{submission.studentName}</span>
              <span className="text-[10px] text-[#888]">•</span>
              <span className="text-[11px] text-indigo-400 font-mono">{submission.prn}</span>
              <span className="text-[10px] text-[#888]">•</span>
              <span className="text-[11px] text-[#999]">{submission.assignmentTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#888]">
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </span>
            <button
              onClick={() => setSelectedId(null)}
              className="text-[11px] text-[#999] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Icon name="Users" size={13} />
              All Students
            </button>
          </div>
        </div>

        {/* ════ Main Body ════ */}
        <div className="flex-1 flex min-h-0">

          {/* ──── Left Panel: Code / Integrity / Documents ──── */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Panel Tabs */}
            <div className="h-[32px] bg-[#252526] flex items-center border-b border-[#1e1e1e] flex-shrink-0 px-2">
              {[
                { id: 'code', label: 'Student Code', icon: 'Code2' },
                { id: 'integrity', label: 'Integrity Report', icon: 'Shield' },
                { id: 'documents', label: 'Documents', icon: 'FileText' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={`flex items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                    activePanel === tab.id
                      ? 'text-white bg-[#1e1e1e] rounded-t'
                      : 'text-[#888] hover:text-[#ccc]'
                  }`}
                >
                  <Icon name={tab.icon} size={12} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Panel */}
            {activePanel === 'code' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* File Tabs */}
                <div className="h-[30px] bg-[#252526] flex items-end overflow-x-auto flex-shrink-0 border-b border-[#1e1e1e]">
                  {Object.keys(submission.files).map(filePath => {
                    const fname = filePath.split('/').pop();
                    const isActive = filePath === activeFile;
                    return (
                      <button
                        key={filePath}
                        onClick={() => setActiveFile(filePath)}
                        className={`flex items-center gap-1.5 h-[30px] px-3 text-[11px] border-r border-[#252526] flex-shrink-0 ${
                          isActive ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-[#999] hover:text-[#ccc]'
                        }`}
                      >
                        <Icon name="FileCode" size={12} className={isActive ? 'text-blue-400' : 'text-[#888]'} />
                        {fname}
                      </button>
                    );
                  })}
                </div>

                {/* Run Button Toolbar */}
                <div className="h-[36px] bg-[#1e1e1e] flex items-center px-3 gap-2 border-b border-[#333] flex-shrink-0">
                  <button
                    onClick={executeCode}
                    disabled={isRunning}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                      isRunning
                        ? 'bg-gray-600 text-gray-300 cursor-wait'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Icon name={isRunning ? 'Loader2' : 'Play'} size={13} className={isRunning ? 'animate-spin' : ''} />
                    {isRunning ? 'Running…' : 'Run Code'}
                  </button>
                  {showOutput && (
                    <button
                      onClick={() => setShowOutput(false)}
                      className="ml-auto text-[11px] text-[#888] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Icon name="X" size={12} />
                      Close Output
                    </button>
                  )}
                </div>

                {/* Read-only Monaco Editor */}
                <div className={showOutput ? 'h-[55%] min-h-0' : 'flex-1 min-h-0'}>
                  <Editor
                    height="100%"
                    language={currentLang}
                    value={submission.files[activeFile]?.content || ''}
                    theme="vs-dark"
                    path={activeFile}
                    options={{
                      readOnly: true,
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      minimap: { enabled: true },
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      automaticLayout: true,
                      padding: { top: 8 },
                      renderLineHighlight: 'all',
                    }}
                  />
                </div>

                {/* Output Terminal Panel */}
                {showOutput && (
                  <div className="h-[45%] bg-[#1a1a1a] border-t border-[#333] flex flex-col min-h-0">
                    <div className="h-[28px] bg-[#252526] flex items-center px-3 flex-shrink-0 border-b border-[#333]">
                      <span className="text-[11px] font-semibold text-[#ccc] flex items-center gap-1.5">
                        <Icon name="Terminal" size={12} className="text-emerald-400" />
                        Output
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed">
                      {codeOutput ? (
                        <pre className={`whitespace-pre-wrap ${codeOutput.ok ? 'text-emerald-300' : 'text-red-400'}`}>
                          {codeOutput.out}
                        </pre>
                      ) : (
                        <span className="text-[#666] italic">Click "Run Code" to see output…</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Integrity Panel */}
            {activePanel === 'integrity' && (() => {
              const sm = submission.integrityReport.summary;
              const riskScore = Math.min(100, Math.round(
                (sm.pasteEventsCount * 3) + (sm.aiUsageCount * 5) + (sm.tabSwitchEvents * 1) + (sm.focusLossEvents * 1.5) + (sm.criticalEventsCount * 8)
              ));
              const humanScore = Math.max(0, 100 - riskScore);
              const isClean = riskScore <= 15;
              const isMedium = riskScore > 15 && riskScore <= 45;
              const ringColor = isClean ? 'border-emerald-500 bg-emerald-900/40' : isMedium ? 'border-amber-500 bg-amber-900/40' : 'border-red-500 bg-red-900/40';
              const textColor = isClean ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-red-400';
              const bgColor = isClean ? 'bg-emerald-900/20 border-emerald-700/50' : isMedium ? 'bg-amber-900/20 border-amber-700/50' : 'bg-red-900/20 border-red-700/50';
              const label = isClean ? 'Mostly Original' : isMedium ? 'Some External Help' : 'Significant External Activity';
              const desc = isClean
                ? 'Minimal external activity detected. Code appears to be mostly self-written.'
                : isMedium
                ? 'Some copy-paste activity and tab switches detected. Student may have referenced external resources.'
                : 'High external activity — multiple paste events, tab switches, and possible AI assistance detected.';
              return (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Integrity Score Badge */}
                <div className={`${bgColor} border rounded-xl p-5`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full border-4 ${ringColor} flex items-center justify-center shrink-0`}>
                      <span className={`text-[20px] font-bold ${textColor}`}>{humanScore}%</span>
                    </div>
                    <div>
                      <p className={`text-[15px] font-bold ${textColor} flex items-center gap-2`}>
                        <Icon name={isClean ? 'ShieldCheck' : isMedium ? 'ShieldAlert' : 'ShieldX'} size={18} className={textColor} />
                        {label}
                      </p>
                      <p className="text-[12px] text-[#999] mt-1">{desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {[
                      { label: 'Paste Events', value: String(sm.pasteEventsCount), icon: 'Clipboard', warn: sm.pasteEventsCount > 0 },
                      { label: 'AI Usage', value: String(sm.aiUsageCount), icon: 'Sparkles', warn: sm.aiUsageCount > 0 },
                      { label: 'Tab Switches', value: String(sm.tabSwitchEvents), icon: 'Monitor', warn: sm.tabSwitchEvents > 3 },
                      { label: 'Risk Score', value: riskScore + '%', icon: 'Shield', warn: riskScore > 15 },
                    ].map((s, i) => (
                      <div key={i} className="bg-[#1e1e1e] rounded-lg p-2.5 text-center border border-[#3c3c3c]">
                        <Icon name={s.icon} size={14} className={`${s.warn ? 'text-amber-500' : 'text-emerald-500'} mx-auto mb-1`} />
                        <p className={`text-[14px] font-bold ${s.warn ? 'text-amber-400' : 'text-emerald-400'}`}>{s.value}</p>
                        <p className="text-[9px] text-[#888] mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <IntegrityReport
                  report={submission.integrityReport}
                  studentName={submission.studentName}
                  assignmentTitle={submission.assignmentTitle}
                  darkMode={true}
                />
              </div>
              );
            })()}

            {/* Documents Panel */}
            {activePanel === 'documents' && (
              <div className="flex-1 overflow-y-auto p-6">
                {/* AI Detection Results from report submissions */}
                {(() => {
                  const reportData = loadReportSubmission(submission.assignmentId);
                  if (reportData && reportData.aiDetection) {
                    const ai = reportData.aiDetection;
                    const riskColors = {
                      low: { bg: 'bg-emerald-900/30', border: 'border-emerald-700', text: 'text-emerald-400', badge: 'bg-emerald-800 text-emerald-300' },
                      medium: { bg: 'bg-amber-900/30', border: 'border-amber-700', text: 'text-amber-400', badge: 'bg-amber-800 text-amber-300' },
                      high: { bg: 'bg-orange-900/30', border: 'border-orange-700', text: 'text-orange-400', badge: 'bg-orange-800 text-orange-300' },
                      critical: { bg: 'bg-red-900/30', border: 'border-red-700', text: 'text-red-400', badge: 'bg-red-800 text-red-300' },
                    };
                    const rc = riskColors[ai.riskLevel] || riskColors.low;
                    return (
                      <div className="space-y-4">
                        {/* File Info */}
                        <div className="flex items-center gap-3 bg-[#252526] rounded-lg p-3 border border-[#3c3c3c]">
                          <Icon name="FileText" size={20} className="text-[#888]" />
                          <div className="flex-1">
                            <p className="text-[13px] text-[#ccc]">{reportData.fileName}</p>
                            <p className="text-[11px] text-[#888]">{(reportData.fileSize / 1024).toFixed(0)} KB • {reportData.extractedTextLength.toLocaleString()} chars extracted</p>
                          </div>
                          <span className="text-[10px] text-[#888]">{new Date(reportData.submittedAt).toLocaleString()}</span>
                        </div>

                        {/* AI Detection Card */}
                        <div className={`rounded-lg border p-4 ${rc.bg} ${rc.border}`}>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[13px] font-semibold text-white flex items-center gap-1.5">
                              <Icon name="Shield" size={14} className="text-indigo-400" />
                              AI Content Detection
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${rc.badge}`}>
                              {ai.riskLevel.toUpperCase()}
                            </span>
                          </div>

                          {/* Score Circle */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                              ai.score >= 50 ? 'border-red-500 bg-red-900/40' :
                              ai.score >= 25 ? 'border-amber-500 bg-amber-900/40' : 'border-emerald-500 bg-emerald-900/40'
                            }`}>
                              <span className="text-[18px] font-bold text-white">{ai.score}%</span>
                            </div>
                            <div>
                              <p className={`text-[14px] font-semibold ${rc.text}`}>{ai.verdict}</p>
                              <p className="text-[11px] text-[#888]">AI Probability Score</p>
                            </div>
                          </div>

                          {/* Breakdown */}
                          <div className="space-y-2 mb-3">
                            {[
                              { label: 'Heuristic', ...ai.breakdown.heuristic },
                              { label: 'Gemini AI', ...ai.breakdown.gemini },
                            ].map((layer, i) => (
                              <div key={i}>
                                <div className="flex justify-between text-[10px] mb-1">
                                  <span className="text-[#aaa]">{layer.label}</span>
                                  <span className="text-[#888]">{layer.score}/{layer.maxScore}</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#3c3c3c] rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${
                                    layer.score / layer.maxScore > 0.6 ? 'bg-red-500' :
                                    layer.score / layer.maxScore > 0.3 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`} style={{ width: `${(layer.score / layer.maxScore) * 100}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Gemini Reasoning */}
                          {ai.breakdown.gemini?.reasoning && (
                            <div className="bg-[#1e1e1e] rounded p-3 border border-[#3c3c3c] mb-3">
                              <p className="text-[10px] text-[#888] font-semibold mb-1 flex items-center gap-1">
                                <Icon name="Sparkles" size={11} className="text-indigo-400" /> Gemini Analysis
                              </p>
                              <p className="text-[11px] text-[#bbb] leading-relaxed">{ai.breakdown.gemini.reasoning}</p>
                            </div>
                          )}

                          {/* Signals */}
                          {ai.allSignals && ai.allSignals.filter(s => s.weight > 0).length > 0 && (
                            <div>
                              <p className="text-[10px] text-[#888] font-semibold mb-2">Signals ({ai.allSignals.filter(s => s.weight > 0).length})</p>
                              <div className="space-y-1">
                                {ai.allSignals.filter(s => s.weight > 0).slice(0, 8).map((s, i) => (
                                  <div key={i} className="flex items-center gap-2 text-[10px] bg-[#1e1e1e] rounded px-2 py-1.5 border border-[#3c3c3c]">
                                    <Icon name={s.weight >= 10 ? 'AlertOctagon' : 'AlertTriangle'} size={11}
                                      className={s.weight >= 10 ? 'text-red-400' : 'text-amber-400'} />
                                    <span className="flex-1 text-[#bbb]">{s.detail}</span>
                                    <span className={`font-mono px-1 rounded ${s.weight >= 10 ? 'bg-red-900/40 text-red-400' : 'bg-amber-900/40 text-amber-400'}`}>+{s.weight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Fallback: regular documents display
                  return submission.documents && submission.documents.length > 0 ? (
                    <div className="space-y-3">
                      {submission.documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 bg-[#252526] rounded-lg p-3 border border-[#3c3c3c]">
                          <Icon name="FileText" size={20} className="text-[#888]" />
                          <div className="flex-1">
                            <p className="text-[13px] text-[#ccc]">{doc.name}</p>
                            <p className="text-[11px] text-[#888]">{doc.size}</p>
                          </div>
                          <button className="text-[#888] hover:text-blue-400 transition-colors">
                            <Icon name="Download" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="FileText" size={32} className="text-[#555] mx-auto mb-3" />
                      <p className="text-[#888] text-sm">No documents submitted</p>
                      <p className="text-[#666] text-xs mt-1">This is a code-only assignment</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* ──── Right Panel: Grading ──── */}
          <div className="w-[340px] bg-[#252526] border-l border-[#1e1e1e] flex flex-col flex-shrink-0 overflow-hidden">

            {/* Grading Header */}
            <div className="px-4 py-3 border-b border-[#1e1e1e] flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-[#bbb] uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="ClipboardCheck" size={14} className="text-emerald-400" />
                  Grading
                </h3>
                <div className={`text-lg font-bold ${allScored ? 'text-white' : 'text-[#888]'}`}>
                  {totalScore}<span className="text-[12px] text-[#888] font-normal">/{totalMax}</span>
                </div>
              </div>
              {allScored && (
                <div className="mt-1.5 w-full h-1.5 bg-[#3c3c3c] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      totalScore / totalMax >= 0.9 ? 'bg-emerald-500' :
                      totalScore / totalMax >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(totalScore / totalMax) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Rubric Scoring */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                <p className="text-[10px] text-[#888] uppercase tracking-wider font-semibold">Rubric Criteria</p>

                {rubricScores.map((criterion, i) => (
                  <div key={i} className="bg-[#1e1e1e] rounded-lg p-3 border border-[#3c3c3c]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-[#ccc] font-medium">{criterion.criterion}</span>
                      <span className="text-[10px] text-[#888]">/{criterion.maxScore}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        value={criterion.score ?? ''}
                        onChange={e => updateRubricScore(i, e.target.value)}
                        placeholder="—"
                        className="w-16 px-2 py-1 bg-[#3c3c3c] border border-[#555] text-[13px] text-white rounded focus:outline-none focus:border-[#007acc] text-center"
                      />
                      <div className="flex-1 h-1.5 bg-[#3c3c3c] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            (parseInt(criterion.score) || 0) / criterion.maxScore >= 0.8 ? 'bg-emerald-500' :
                            (parseInt(criterion.score) || 0) / criterion.maxScore >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${((parseInt(criterion.score) || 0) / criterion.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={criterion.comment}
                      onChange={e => updateRubricComment(i, e.target.value)}
                      placeholder="Add comment..."
                      className="w-full px-2 py-1 bg-[#3c3c3c] border border-[#555] text-[11px] text-[#ccc] rounded focus:outline-none focus:border-[#007acc] placeholder:text-[#666]"
                    />
                  </div>
                ))}
              </div>

              {/* Overall Feedback */}
              <div className="px-4 pb-4">
                <p className="text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-2">
                  Overall Feedback
                </p>
                <textarea
                  value={overallFeedback}
                  onChange={e => setOverallFeedback(e.target.value)}
                  placeholder="Write feedback for the student..."
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#3c3c3c] text-[12px] text-[#ccc] rounded-lg focus:outline-none focus:border-[#007acc] placeholder:text-[#666] resize-none"
                />
              </div>

              {/* Quick Marks */}
              <div className="px-4 pb-4">
                <p className="text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-2">
                  Quick Score
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {[100, 90, 80, 70, 60, 50, 0].map(pct => (
                    <button
                      key={pct}
                      onClick={() => {
                        rubricScores.forEach((r, i) => {
                          updateRubricScore(i, Math.round(r.maxScore * pct / 100));
                        });
                      }}
                      className="px-2 py-1 bg-[#3c3c3c] text-[10px] text-[#ccc] rounded border border-[#555] hover:border-[#888] transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Info */}
              <div className="px-4 pb-4">
                <p className="text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-2">
                  Student Info
                </p>
                <div className="bg-[#1e1e1e] rounded-lg p-3 border border-[#3c3c3c] space-y-1 text-[11px]">
                  <p><span className="text-[#888]">Name:</span> <span className="text-[#ccc]">{submission.studentName}</span></p>
                  <p><span className="text-[#888]">PRN:</span> <span className="text-indigo-400 font-mono">{submission.prn}</span></p>
                  <p><span className="text-[#888]">Email:</span> <span className="text-[#ccc]">{submission.studentEmail}</span></p>
                  <p><span className="text-[#888]">Submitted:</span> <span className="text-[#ccc]">{new Date(submission.submittedAt).toLocaleString()}</span></p>
                  <p><span className="text-[#888]">Files:</span> <span className="text-[#ccc]">{Object.keys(submission.files).length} file(s)</span></p>
                </div>
              </div>
            </div>

            {/* Submit Grade */}
            <div className="px-4 py-3 border-t border-[#1e1e1e] flex-shrink-0">
              <Button onClick={handleSubmitGrade} className="w-full justify-center">
                <Icon name="Send" size={14} className="mr-1" />
                Submit Grade ({totalScore}/{totalMax})
              </Button>
            </div>
          </div>

          {/* Overlay removed — using list view instead */}
        </div>

        {/* ════ Status Bar ════ */}
        <div className="h-[22px] bg-[#68217a] flex items-center justify-between px-3 flex-shrink-0 text-[11px] text-white/90">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Icon name="GraduationCap" size={11} />Teacher Mode</span>
            <span>{submission.studentName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{currentLang.toUpperCase()}</span>
            <span>Read Only</span>
            <span>{totalScore}/{totalMax} pts</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherReview;
