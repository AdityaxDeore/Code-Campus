import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import useAuth from '../../hooks/useAuth';
import { createTestResult } from '../../lib/firestore';

const PASTE_WORD_LIMIT = 5;
const MAX_TAB_WARNINGS = 3;

const mockTests = [
  { id: 't1', title: 'DSA Mid-Semester Exam', subject: 'DSA', duration: 90, totalMarks: 200, questions: 3, status: 'available', type: 'coding' },
  { id: 't2', title: 'DBMS Quiz 3', subject: 'DBMS', duration: 30, totalMarks: 50, questions: 2, status: 'available', type: 'coding' },
  { id: 't3', title: 'OOPS Final Lab Test', subject: 'OOPS', duration: 120, totalMarks: 300, questions: 5, status: 'upcoming', startsAt: new Date(Date.now() + 48 * 36e5).toISOString(), type: 'coding' },
  { id: 't4', title: 'Web Dev Practical', subject: 'Web Dev', duration: 60, totalMarks: 100, questions: 2, status: 'completed', scored: 78, type: 'coding' },
  { id: 't5', title: 'DSA Concepts Quiz', subject: 'DSA', duration: 45, totalMarks: 100, questions: 10, status: 'available', type: 'mcq' },
  { id: 't6', title: 'DBMS Theory Test', subject: 'DBMS', duration: 30, totalMarks: 80, questions: 8, status: 'available', type: 'mcq' },
  { id: 't7', title: 'OOPS Fundamentals Quiz', subject: 'OOPS', duration: 40, totalMarks: 100, questions: 10, status: 'available', type: 'mcq' },
  { id: 't8', title: 'Operating Systems MCQ', subject: 'OS', duration: 35, totalMarks: 70, questions: 7, status: 'available', type: 'mcq' },
];

const testQuestions = {
  t1: [
    { id: 'q1', title: 'Implement a Min-Heap', description: 'Implement a min-heap with insert, extractMin, and heapify operations.\n\nConstraints:\n- Use array-based representation\n- Support up to 10^5 elements', language: 'python', marks: 70, starterCode: '# Min-Heap Implementation\n\nclass MinHeap:\n    def __init__(self):\n        self.heap = []\n\n    def insert(self, val):\n        # TODO\n        pass\n\n    def extract_min(self):\n        # TODO\n        pass\n\n    def heapify(self, i):\n        # TODO\n        pass\n', type: 'coding' },
    { id: 'q2', title: 'Shortest Path – Dijkstra', description: 'Implement Dijkstra\'s algorithm for a weighted directed graph.\n\nInput: adjacency list with weights\nOutput: shortest distances from source', language: 'python', marks: 80, starterCode: 'import heapq\n\ndef dijkstra(graph, source):\n    # TODO: implement\n    pass\n', type: 'coding' },
    { id: 'q3', title: 'LRU Cache', description: 'Design and implement an LRU Cache with O(1) get and put.\n\nclass LRUCache:\n  - get(key): return value or -1\n  - put(key, value): insert/update', language: 'python', marks: 50, starterCode: 'class LRUCache:\n    def __init__(self, capacity: int):\n        # TODO\n        pass\n\n    def get(self, key: int) -> int:\n        # TODO\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        # TODO\n        pass\n', type: 'coding' },
  ],
  t2: [
    { id: 'q1', title: 'SQL Joins', description: 'Write queries using different types of JOINs.', language: 'sql', marks: 25, starterCode: '-- Write your SQL queries here\n', type: 'coding' },
    { id: 'q2', title: 'Subqueries', description: 'Write nested subqueries for the given schema.', language: 'sql', marks: 25, starterCode: '-- Subqueries exercise\n', type: 'coding' },
  ],
  t5: [
    { id: 'q1', title: 'Binary Search Tree', description: 'What is the time complexity of searching in a balanced BST?', marks: 10, type: 'mcq', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 1 },
    { id: 'q2', title: 'Graph Traversal', description: 'Which data structure is used in BFS?', marks: 10, type: 'mcq', options: ['Stack', 'Queue', 'Heap', 'Tree'], correct: 1 },
    { id: 'q3', title: 'Sorting Algorithm', description: 'Which sorting algorithm has the best average case time complexity?', marks: 10, type: 'mcq', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], correct: 2 },
    { id: 'q4', title: 'Hash Table', description: 'What is the average time complexity of insertion in a hash table?', marks: 10, type: 'mcq', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 0 },
    { id: 'q5', title: 'Linked List', description: 'What is the time complexity of inserting at the beginning of a singly linked list?', marks: 10, type: 'mcq', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 0 },
    { id: 'q6', title: 'Dynamic Programming', description: 'Which technique does dynamic programming use?', marks: 10, type: 'mcq', options: ['Divide and conquer', 'Greedy approach', 'Memoization', 'Backtracking'], correct: 2 },
    { id: 'q7', title: 'Stack Operation', description: 'Which of these is NOT a stack operation?', marks: 10, type: 'mcq', options: ['Push', 'Pop', 'Peek', 'Dequeue'], correct: 3 },
    { id: 'q8', title: 'Tree Height', description: 'What is the height of a complete binary tree with n nodes?', marks: 10, type: 'mcq', options: ['log₂(n)', '√n', 'n', 'n log n'], correct: 0 },
    { id: 'q9', title: 'Graph Type', description: 'A tree is a special type of...', marks: 10, type: 'mcq', options: ['Cyclic graph', 'Acyclic directed graph', 'Acyclic undirected graph', 'Complete graph'], correct: 2 },
    { id: 'q10', title: 'Array Access', description: 'What is the time complexity of accessing an element in an array by index?', marks: 10, type: 'mcq', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 0 },
  ],
  t6: [
    { id: 'q1', title: 'Normalization', description: 'Which normal form eliminates transitive dependency?', marks: 10, type: 'mcq', options: ['1NF', '2NF', '3NF', 'BCNF'], correct: 2 },
    { id: 'q2', title: 'SQL Join', description: 'Which join returns all rows from both tables?', marks: 10, type: 'mcq', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct: 3 },
    { id: 'q3', title: 'ACID Properties', description: 'What does "I" stand for in ACID?', marks: 10, type: 'mcq', options: ['Integrity', 'Isolation', 'Independence', 'Indexing'], correct: 1 },
    { id: 'q4', title: 'Primary Key', description: 'A primary key can contain...', marks: 10, type: 'mcq', options: ['NULL values', 'Duplicate values', 'Both NULL and duplicates', 'Neither NULL nor duplicates'], correct: 3 },
    { id: 'q5', title: 'Transaction', description: 'Which command is used to permanently save changes in a transaction?', marks: 10, type: 'mcq', options: ['SAVE', 'COMMIT', 'ROLLBACK', 'UPDATE'], correct: 1 },
    { id: 'q6', title: 'Index', description: 'What is the primary purpose of database indexing?', marks: 10, type: 'mcq', options: ['Save storage', 'Speed up queries', 'Enforce constraints', 'Backup data'], correct: 1 },
    { id: 'q7', title: 'Foreign Key', description: 'A foreign key establishes...', marks: 10, type: 'mcq', options: ['Uniqueness', 'A relationship between tables', 'Data type', 'Table structure'], correct: 1 },
    { id: 'q8', title: 'Aggregate Function', description: 'Which is NOT an aggregate function in SQL?', marks: 10, type: 'mcq', options: ['COUNT', 'SUM', 'WHERE', 'AVG'], correct: 2 },
  ],
  t7: [
    { id: 'q1', title: 'Encapsulation', description: 'Encapsulation in OOP refers to...', marks: 10, type: 'mcq', options: ['Hiding implementation details', 'Creating multiple objects', 'Inheriting properties', 'Overloading methods'], correct: 0 },
    { id: 'q2', title: 'Inheritance', description: 'Which type of inheritance uses multiple parent classes?', marks: 10, type: 'mcq', options: ['Single', 'Multiple', 'Multilevel', 'Hierarchical'], correct: 1 },
    { id: 'q3', title: 'Polymorphism', description: 'Method overloading is an example of...', marks: 10, type: 'mcq', options: ['Compile-time polymorphism', 'Runtime polymorphism', 'Encapsulation', 'Abstraction'], correct: 0 },
    { id: 'q4', title: 'Abstract Class', description: 'An abstract class can...', marks: 10, type: 'mcq', options: ['Be instantiated directly', 'Contain only abstract methods', 'Contain both abstract and concrete methods', 'Not have constructors'], correct: 2 },
    { id: 'q5', title: 'Interface', description: 'In Java, a class can implement...', marks: 10, type: 'mcq', options: ['Only one interface', 'Multiple interfaces', 'No interfaces', 'Only abstract interfaces'], correct: 1 },
    { id: 'q6', title: 'Constructor', description: 'Which is true about constructors?', marks: 10, type: 'mcq', options: ['They have return types', 'They must be public', 'They have the same name as the class', 'They cannot be overloaded'], correct: 2 },
    { id: 'q7', title: 'Static Members', description: 'Static methods can access...', marks: 10, type: 'mcq', options: ['Only static members', 'Only instance members', 'Both static and instance members', 'No other members'], correct: 0 },
    { id: 'q8', title: 'Method Overriding', description: 'Method overriding requires...', marks: 10, type: 'mcq', options: ['Same class', 'Different parameter lists', 'Inheritance relationship', 'Static methods'], correct: 2 },
    { id: 'q9', title: 'Access Modifier', description: 'Which access modifier is most restrictive?', marks: 10, type: 'mcq', options: ['public', 'protected', 'default', 'private'], correct: 3 },
    { id: 'q10', title: 'Composition', description: 'Composition represents...', marks: 10, type: 'mcq', options: ['"is-a" relationship', '"has-a" relationship', '"can-be" relationship', '"was-a" relationship'], correct: 1 },
  ],
  t8: [
    { id: 'q1', title: 'Process vs Thread', description: 'What is shared between threads of the same process?', marks: 10, type: 'mcq', options: ['Stack', 'Registers', 'Heap memory', 'Program counter'], correct: 2 },
    { id: 'q2', title: 'Deadlock', description: 'Which is NOT a condition for deadlock?', marks: 10, type: 'mcq', options: ['Mutual exclusion', 'Hold and wait', 'Preemption', 'Circular wait'], correct: 2 },
    { id: 'q3', title: 'CPU Scheduling', description: 'Which scheduling algorithm can cause starvation?', marks: 10, type: 'mcq', options: ['FCFS', 'Round Robin', 'Priority Scheduling', 'SJF'], correct: 2 },
    { id: 'q4', title: 'Paging', description: 'What is the main advantage of paging?', marks: 10, type: 'mcq', options: ['Faster execution', 'No external fragmentation', 'No internal fragmentation', 'Less memory usage'], correct: 1 },
    { id: 'q5', title: 'Semaphore', description: 'A binary semaphore can have values...', marks: 10, type: 'mcq', options: ['0 or 1', '0 to n', '-1 to 1', 'Any integer'], correct: 0 },
    { id: 'q6', title: 'Virtual Memory', description: 'Virtual memory allows...', marks: 10, type: 'mcq', options: ['Faster CPU', 'Executing programs larger than physical memory', 'More cache', 'Better graphics'], correct: 1 },
    { id: 'q7', title: 'Context Switch', description: 'Context switching occurs when...', marks: 10, type: 'mcq', options: ['A program terminates', 'CPU switches from one process to another', 'Memory is allocated', 'I/O operation completes'], correct: 1 },
  ],
};

const langMap = { python: 'python', java: 'java', javascript: 'javascript', sql: 'sql', cpp: 'cpp' };

// ───── Test Lobby ─────
const TestLobby = ({ onStart }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredTests = filter === 'all' 
    ? mockTests 
    : mockTests.filter(t => t.type === filter);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-[900px] mx-auto px-5 py-10">
        <Link to="/student-dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <Icon name="ArrowLeft" size={14} /> Back to Dashboard
        </Link>

        <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight mb-1">Tests & Exams</h1>
        <p className="text-[13px] text-slate-500 mb-6">Proctored coding exams — tab changes and pasting are monitored</p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
              filter === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Tests
          </button>
          <button
            onClick={() => setFilter('mcq')}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
              filter === 'mcq' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            MCQ Only
          </button>
          <button
            onClick={() => setFilter('coding')}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
              filter === 'coding' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Coding Only
          </button>
        </div>

        <div className="space-y-3">
          {filteredTests.map(t => (
            <div key={t.id}
              className="bg-white rounded-lg border border-slate-200/80 p-4 flex items-center justify-between gap-4"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,.03)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-medium text-slate-900">{t.title}</span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{t.subject}</span>
                  {t.type === 'mcq' && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">MCQ</span>
                  )}
                  {t.type === 'coding' && (
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase">Coding</span>
                  )}
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

// ───── MCQ Question Component ─────
const MCQQuestion = ({ question, answer, onChange, currentQ, questions, onQuestionChange }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Question Navigation Bar */}
      <div className="flex border-b border-[#3c3c3c] overflow-x-auto bg-[#252526] px-4">
        {questions.map((qq, i) => (
          <button key={qq.id} onClick={() => onQuestionChange(i)}
            className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap transition-colors ${
              currentQ === i ? 'text-white border-b-2 border-blue-500' : 'text-[#888] hover:text-[#ccc]'
            }`}
          >
            Q{i + 1} ({qq.marks}m)
          </button>
        ))}
      </div>
      
      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-[18px] font-semibold text-[#e0e0e0] mb-3">{question.title}</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-semibold text-[#888] bg-[#333] px-1.5 py-0.5 rounded uppercase">MCQ</span>
            <span className="text-[11px] text-[#888]">{question.marks} marks</span>
          </div>
          <p className="text-[14px] text-[#ccc] mb-6 leading-relaxed">{question.description}</p>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <label key={idx}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answer === idx 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-[#3c3c3c] bg-[#252526] hover:border-[#555] hover:bg-[#2a2a2a]'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answer === idx}
                  onChange={() => onChange(idx)}
                  className="mt-0.5 w-4 h-4 accent-blue-500"
                />
                <span className="text-[13px] text-[#e0e0e0] flex-1">{option}</span>
              </label>
            ))}
          </div>
          
          {answer !== null && (
            <div className="mt-4 text-[12px] text-emerald-400 flex items-center gap-1.5">
              <Icon name="CheckCircle2" size={12} /> Answer selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ───── Proctored Test Environment ─────
const ProctoredTest = ({ test }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const questions = testQuestions[test.id] || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(q => q.type === 'mcq' ? null : q.starterCode));
  const [tabWarnings, setTabWarnings] = useState(0);
  const [pasteFlags, setPasteFlags] = useState([]);
  const [pasteToast, setPasteToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60); // seconds
  const [submitted, setSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  const q = questions[currentQ];

  // ── Fullscreen management (aggressive) ──
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      // Lock Escape key so OS-level fullscreen exit is blocked (Chromium)
      if (navigator.keyboard && navigator.keyboard.lock) {
        navigator.keyboard.lock(['Escape']).catch(() => {});
      }
    } catch { /* user denied */ }
  }, []);

  // Enter fullscreen on mount
  useEffect(() => {
    enterFullscreen();
  }, [enterFullscreen]);

  // Fullscreen exit → instant warning + instant re-entry
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        setTabWarnings(prev => {
          const next = prev + 1;
          if (next >= MAX_TAB_WARNINGS) setSubmitted(true);
          return next;
        });
        // Immediately re-enter
        enterFullscreen();
      } else {
        setIsFullscreen(true);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [enterFullscreen]);

  // ── Continuous fullscreen polling (every 500ms) ──
  // Catches ANY scenario where fullscreen was lost
  useEffect(() => {
    const interval = setInterval(() => {
      if (!submitted && !document.fullscreenElement) {
        enterFullscreen();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [submitted, enterFullscreen]);

  // ── Block ALL dangerous keys ──
  useEffect(() => {
    const blockKeys = (e) => {
      if (
        e.key === 'Escape' ||
        e.key === 'F11' ||
        (e.altKey && e.key === 'Tab') ||
        (e.altKey && e.key === 'F4') ||
        (e.ctrlKey && (e.key === 'w' || e.key === 'W')) ||
        (e.ctrlKey && (e.key === 't' || e.key === 'T')) ||
        (e.ctrlKey && (e.key === 'n' || e.key === 'N')) ||
        (e.ctrlKey && e.shiftKey) ||
        e.key === 'Meta' || e.key === 'OS'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener('keydown', blockKeys, true);
    document.addEventListener('keyup', blockKeys, true);
    return () => {
      document.removeEventListener('keydown', blockKeys, true);
      document.removeEventListener('keyup', blockKeys, true);
    };
  }, []);

  // ── Block right-click context menu ──
  useEffect(() => {
    const block = (e) => { e.preventDefault(); return false; };
    document.addEventListener('contextmenu', block, true);
    return () => document.removeEventListener('contextmenu', block, true);
  }, []);

  // ── Block tab/window close ──
  useEffect(() => {
    const preventClose = (e) => {
      e.preventDefault();
      e.returnValue = 'Your test is still in progress. Leaving will count as a violation.';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', preventClose);
    return () => window.removeEventListener('beforeunload', preventClose);
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
      } else {
        // Returning from alt-tab / 3-finger swipe — snap back immediately
        enterFullscreen();
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [enterFullscreen]);

  // ── Window blur + focus: catches alt-tab / gestures instantly ──
  useEffect(() => {
    const onBlur = () => {
      setTabWarnings(prev => {
        const next = prev + 1;
        if (next >= MAX_TAB_WARNINGS) setSubmitted(true);
        return next;
      });
    };
    const onFocus = () => {
      // Force fullscreen the instant window regains focus
      if (!document.fullscreenElement) enterFullscreen();
    };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [enterFullscreen]);

  // ── Mouse leave detection: warn if cursor tries to leave the page ──
  useEffect(() => {
    const onLeave = () => {
      if (!document.fullscreenElement) enterFullscreen();
    };
    document.addEventListener('mouseleave', onLeave);
    return () => document.removeEventListener('mouseleave', onLeave);
  }, [enterFullscreen]);

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
    // Intercept Ctrl+V / Cmd+V at the Monaco keybinding level as secondary defense
    editor.onKeyDown((e) => {
      const isV = e.browserEvent.key === 'v' || e.browserEvent.key === 'V';
      if ((e.ctrlKey || e.metaKey) && isV) {
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then((text) => {
            const wc = text.trim().split(/\s+/).filter(Boolean).length;
            if (wc >= PASTE_WORD_LIMIT) {
              // Undo the pasted content that may have already been inserted
              editor.trigger('keyboard', 'undo', null);
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

  const handleMCQChange = (optionIdx) => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = optionIdx;
      return next;
    });
  };

  const calculateScore = useCallback(() => {
    if (test.type !== 'mcq') {
      return { score: 0, correct: 0, total: questions.length, maxScore: test.totalMarks, scorePending: true };
    }

    let score = 0;
    let correct = 0;
    questions.forEach((question, idx) => {
      if (answers[idx] === question.correct) {
        score += question.marks;
        correct += 1;
      }
    });

    return { score, correct, total: questions.length, maxScore: test.totalMarks, scorePending: false };
  }, [answers, questions, test]);

  const handleSubmit = async () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    const { score, correct, total, maxScore, scorePending } = calculateScore();

    if (user?.uid) {
      await createTestResult({
        userId: user.uid,
        testId: test.id,
        testTitle: test.title,
        subject: test.subject,
        type: test.type,
        score,
        maxScore,
        scorePending,
        correctCount: correct,
        questionCount: total,
        tabWarnings,
        pasteFlags: pasteFlags.length
      });
    } else if (import.meta.env.DEV) {
      console.warn('[Tests] No authenticated user. Test result not saved.');
    }

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

          {/* Left: Question Panel (only for coding questions) */}
          {q.type === 'coding' && (
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
          )}

          {/* Right: Editor or MCQ */}
          <div className="flex-1 flex flex-col min-w-0">
            {q.type === 'mcq' ? (
              <MCQQuestion 
                question={q} 
                answer={answers[currentQ]} 
                onChange={handleMCQChange}
                currentQ={currentQ}
                questions={questions}
                onQuestionChange={setCurrentQ}
              />
            ) : (
              <Editor
                height="100%"
                language={langMap[q.language] || 'python'}
                value={answers[currentQ]}
                onChange={handleCodeChange}
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
            )}

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
