import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PASTE_WORD_LIMIT = 5;
const MAX_TAB_WARNINGS = 3;

const mockTests = [
  { id: 't1', title: 'DSA Mid-Semester Exam', subject: 'DSA', duration: 90, totalMarks: 200, questions: 3, status: 'available' },
  { id: 't2', title: 'DBMS Quiz 3', subject: 'DBMS', duration: 30, totalMarks: 50, questions: 2, status: 'available' },
  { id: 't3', title: 'OOPS Final Lab Test', subject: 'OOPS', duration: 120, totalMarks: 300, questions: 5, status: 'upcoming', startsAt: new Date(Date.now() + 48 * 36e5).toISOString() },
  { id: 't4', title: 'Web Dev Practical', subject: 'Web Dev', duration: 60, totalMarks: 100, questions: 2, status: 'completed', scored: 78 },
];

const testQuestions = {
  t1: [
    { id: 'q1', title: 'Implement a Min-Heap', description: 'Implement a min-heap with insert, extractMin, and heapify operations.\n\nConstraints:\n- Use array-based representation\n- Support up to 10^5 elements', language: 'python', marks: 70, starterCode: '# Min-Heap Implementation\n\nclass MinHeap:\n    def __init__(self):\n        self.heap = []\n\n    def insert(self, val):\n        # TODO\n        pass\n\n    def extract_min(self):\n        # TODO\n        pass\n\n    def heapify(self, i):\n        # TODO\n        pass\n' },
    { id: 'q2', title: 'Shortest Path – Dijkstra', description: 'Implement Dijkstra\'s algorithm for a weighted directed graph.\n\nInput: adjacency list with weights\nOutput: shortest distances from source', language: 'python', marks: 80, starterCode: 'import heapq\n\ndef dijkstra(graph, source):\n    # TODO: implement\n    pass\n' },
    { id: 'q3', title: 'LRU Cache', description: 'Design and implement an LRU Cache with O(1) get and put.\n\nclass LRUCache:\n  - get(key): return value or -1\n  - put(key, value): insert/update', language: 'python', marks: 50, starterCode: 'class LRUCache:\n    def __init__(self, capacity: int):\n        # TODO\n        pass\n\n    def get(self, key: int) -> int:\n        # TODO\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        # TODO\n        pass\n' },
  ],
  t2: [
    { id: 'q1', title: 'SQL Joins', description: 'Write queries using different types of JOINs.', language: 'sql', marks: 25, starterCode: '-- Write your SQL queries here\n' },
    { id: 'q2', title: 'Subqueries', description: 'Write nested subqueries for the given schema.', language: 'sql', marks: 25, starterCode: '-- Subqueries exercise\n' },
  ],
};

const langMap = { python: 'python', java: 'java', javascript: 'javascript', sql: 'sql', cpp: 'cpp' };

// ───── Test Lobby ─────
const TestLobby = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-[900px] mx-auto px-5 py-10">
        <Link to="/student-dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <Icon name="ArrowLeft" size={14} /> Back to Dashboard
        </Link>

        <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight mb-1">Tests & Exams</h1>
        <p className="text-[13px] text-slate-500 mb-6">Proctored coding exams — tab changes and pasting are monitored</p>

        <div className="space-y-3">
          {mockTests.map(t => (
            <div key={t.id}
              className="bg-white rounded-lg border border-slate-200/80 p-4 flex items-center justify-between gap-4"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,.03)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-medium text-slate-900">{t.title}</span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{t.subject}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Icon name="Clock" size={11} />{t.duration} min</span>
                  <span className="flex items-center gap-1"><Icon name="FileText" size={11} />{t.questions} Qs</span>
                  <span className="flex items-center gap-1"><Icon name="Award" size={11} />{t.totalMarks} marks</span>
                  {t.status === 'completed' && <span className="text-emerald-600 font-medium">Score: {t.scored}/{t.totalMarks}</span>}
                  {t.status === 'upcoming' && <span className="text-amber-600 font-medium">Starts: {new Date(t.startsAt).toLocaleDateString()}</span>}
                </div>
              </div>
              {t.status === 'available' && testQuestions[t.id] && (
                <button onClick={() => onStart(t)}
                  className="px-3.5 py-[7px] bg-red-600 text-white text-[12px] font-medium rounded-md hover:bg-red-700 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="ShieldCheck" size={13} /> Start Test
                </button>
              )}
              {t.status === 'upcoming' && (
                <span className="text-[12px] text-slate-400 font-medium">Upcoming</span>
              )}
              {t.status === 'completed' && (
                <span className="text-[12px] text-emerald-600 font-medium flex items-center gap-1"><Icon name="CheckCircle2" size={13} /> Done</span>
              )}
            </div>
          ))}
        </div>

        {/* Proctoring info */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-[13px] font-semibold text-amber-800 flex items-center gap-1.5 mb-2">
            <Icon name="ShieldAlert" size={14} /> Proctoring Rules
          </h3>
          <ul className="text-[12px] text-amber-700 space-y-1">
            <li>• Test runs in fullscreen — exiting fullscreen counts as a warning</li>
            <li>• Switching tabs/windows is detected and logged</li>
            <li>• Pasting {PASTE_WORD_LIMIT} or more words is blocked and flagged</li>
            <li>• {MAX_TAB_WARNINGS} tab-change warnings will auto-submit your test</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ───── Proctored Test Environment ─────
const ProctoredTest = ({ test }) => {
  const navigate = useNavigate();
  const questions = testQuestions[test.id] || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(q => q.starterCode));
  const [tabWarnings, setTabWarnings] = useState(0);
  const [pasteFlags, setPasteFlags] = useState([]);
  const [pasteToast, setPasteToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60); // seconds
  const [submitted, setSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  const q = questions[currentQ];

  // ── Fullscreen management ──
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch { /* user denied */ }
  }, []);

  useEffect(() => {
    enterFullscreen();
  }, [enterFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        setTabWarnings(prev => {
          const next = prev + 1;
          if (next >= MAX_TAB_WARNINGS) setSubmitted(true);
          return next;
        });
      } else {
        setIsFullscreen(true);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ── Tab / visibility change detection ──
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        setTabWarnings(prev => {
          const next = prev + 1;
          if (next >= MAX_TAB_WARNINGS) setSubmitted(true);
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // ── Paste detection & blocking ──
  useEffect(() => {
    const handler = (e) => {
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const wc = pasted.trim().split(/\s+/).filter(Boolean).length;
      if (wc >= PASTE_WORD_LIMIT) {
        e.preventDefault();
        setPasteFlags(prev => [...prev, { time: new Date().toLocaleTimeString(), words: wc }]);
        setPasteToast(`⚠ Paste blocked: ${wc} words detected. External pasting is not allowed.`);
        setTimeout(() => setPasteToast(null), 4000);
      }
    };
    window.addEventListener('paste', handler, true);
    return () => window.removeEventListener('paste', handler, true);
  }, []);

  // ── Monaco editor mount: disable paste keybinding ──
  const handleEditorMount = useCallback((editor) => {
    editorRef.current = editor;
    // Intercept Ctrl+V / Cmd+V at the Monaco keybinding level
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 52 /* KeyV */) {
        // Read clipboard and check word count
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then((text) => {
            const wc = text.trim().split(/\s+/).filter(Boolean).length;
            if (wc >= PASTE_WORD_LIMIT) {
              e.preventDefault();
              e.stopPropagation();
            }
          }).catch(() => {});
        }
      }
    });
  }, []);

  // ── Timer ──
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setSubmitted(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleCodeChange = (value) => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = value || '';
      return next;
    });
  };

  const handleSubmit = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle2" size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Test Submitted</h2>
          <p className="text-[13px] text-slate-500 mb-1">{test.title}</p>
          {tabWarnings > 0 && <p className="text-[12px] text-amber-600">⚠ {tabWarnings} tab-change violation(s) logged</p>}
          {pasteFlags.length > 0 && <p className="text-[12px] text-amber-600">⚠ {pasteFlags.length} paste event(s) flagged</p>}
          <Link to="/test" className="mt-4 inline-block">
            <Button size="sm">Back to Tests</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>{test.title} – Proctored – CodeCampus</title></Helmet>

      <div className="h-screen flex flex-col bg-[#1e1e1e]" ref={containerRef}>

        {/* Fullscreen warning banner */}
        {!isFullscreen && (
          <div className="bg-red-600 text-white text-[12px] font-medium text-center py-1.5 flex items-center justify-center gap-2">
            <Icon name="AlertTriangle" size={13} /> You exited fullscreen — this counts as a warning ({tabWarnings}/{MAX_TAB_WARNINGS})
            <button onClick={enterFullscreen} className="ml-2 underline hover:no-underline">Re-enter</button>
          </div>
        )}

        {/* Paste blocked toast */}
        {pasteToast && (
          <div className="bg-amber-600 text-white text-[12px] font-medium text-center py-1.5 flex items-center justify-center gap-2 animate-pulse">
            <Icon name="Clipboard" size={13} /> {pasteToast}
          </div>
        )}

        {/* Top Bar */}
        <div className="h-11 bg-[#252526] border-b border-[#3c3c3c] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Icon name="ShieldCheck" size={15} className="text-red-400" />
            <span className="text-[12px] text-[#ccc] font-medium">{test.title}</span>
            <span className="text-[10px] text-[#888] bg-[#333] px-1.5 py-0.5 rounded uppercase">{test.subject}</span>
          </div>
          <div className="flex items-center gap-4">
            {pasteFlags.length > 0 && (
              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                <Icon name="Clipboard" size={11} />{pasteFlags.length} flagged
              </span>
            )}
            {tabWarnings > 0 && (
              <span className="text-[11px] text-red-400 flex items-center gap-1">
                <Icon name="Eye" size={11} />{tabWarnings}/{MAX_TAB_WARNINGS} warnings
              </span>
            )}
            <span className={`text-[13px] font-mono font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-[#ccc]'}`}>
              {fmtTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex min-h-0">

          {/* Left: Question Panel */}
          <div className="w-[350px] flex-shrink-0 bg-[#1e1e1e] border-r border-[#3c3c3c] flex flex-col">
            {/* Question tabs */}
            <div className="flex border-b border-[#3c3c3c] overflow-x-auto">
              {questions.map((qq, i) => (
                <button key={qq.id} onClick={() => setCurrentQ(i)}
                  className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap transition-colors ${
                    currentQ === i ? 'text-white border-b-2 border-blue-500 bg-[#252526]' : 'text-[#888] hover:text-[#ccc]'
                  }`}
                >
                  Q{i + 1} ({qq.marks}m)
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-[15px] font-semibold text-[#e0e0e0] mb-2">{q.title}</h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold text-[#888] bg-[#333] px-1.5 py-0.5 rounded uppercase">{q.language}</span>
                <span className="text-[10px] text-[#888]">{q.marks} marks</span>
              </div>
              <pre className="text-[12px] text-[#bbb] whitespace-pre-wrap leading-relaxed font-sans">{q.description}</pre>
            </div>
          </div>

          {/* Right: Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            <Editor
              height="100%"
              language={langMap[q.language] || 'python'}
              value={answers[currentQ]}
              onChange={handleCodeChange}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 4,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
              }}
            />

            {/* Bottom bar */}
            <div className="h-11 bg-[#252526] border-t border-[#3c3c3c] flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}
                  className="px-3 py-[5px] bg-[#333] text-[#ccc] text-[12px] font-medium rounded hover:bg-[#444] transition-colors disabled:opacity-40 flex items-center gap-1"
                >
                  <Icon name="ChevronLeft" size={13} /> Prev
                </button>
                <button disabled={currentQ === questions.length - 1} onClick={() => setCurrentQ(currentQ + 1)}
                  className="px-3 py-[5px] bg-[#333] text-[#ccc] text-[12px] font-medium rounded hover:bg-[#444] transition-colors disabled:opacity-40 flex items-center gap-1"
                >
                  Next <Icon name="ChevronRight" size={13} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#888]">Q{currentQ + 1}/{questions.length}</span>
                <button onClick={handleSubmit}
                  className="px-4 py-[5px] bg-red-600 text-white text-[12px] font-medium rounded hover:bg-red-700 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="Send" size={13} /> End Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ───── Main Component ─────
const TestPage = () => {
  const [activeTest, setActiveTest] = useState(null);

  if (activeTest) {
    return <ProctoredTest test={activeTest} />;
  }

  return (
    <>
      <Helmet><title>Tests – CodeCampus</title></Helmet>
      <TestLobby onStart={setActiveTest} />
    </>
  );
};

export default TestPage;
