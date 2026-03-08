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

import React, { useState, useCallback, useMemo } from 'react';
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
    assignmentId: 'a1',
    assignmentTitle: 'Binary Search Tree – Insert & Delete',
    subject: 'DSA',
    language: 'python',
    maxMarks: 100,
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'submitted',
    files: {
      'src/bst.py': {
        lang: 'python',
        content: `# Binary Search Tree Implementation

class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

class BST:
    def __init__(self):
        self.root = None

    def insert(self, key):
        if self.root is None:
            self.root = Node(key)
        else:
            self._insert_recursive(self.root, key)

    def _insert_recursive(self, node, key):
        if key < node.val:
            if node.left is None:
                node.left = Node(key)
            else:
                self._insert_recursive(node.left, key)
        else:
            if node.right is None:
                node.right = Node(key)
            else:
                self._insert_recursive(node.right, key)

    def search(self, key):
        return self._search_recursive(self.root, key)

    def _search_recursive(self, node, key):
        if node is None:
            return False
        if node.val == key:
            return True
        if key < node.val:
            return self._search_recursive(node.left, key)
        return self._search_recursive(node.right, key)

    def delete(self, key):
        self.root = self._delete_recursive(self.root, key)

    def _delete_recursive(self, node, key):
        if node is None:
            return node
        if key < node.val:
            node.left = self._delete_recursive(node.left, key)
        elif key > node.val:
            node.right = self._delete_recursive(node.right, key)
        else:
            if node.left is None:
                return node.right
            elif node.right is None:
                return node.left
            min_node = self._find_min(node.right)
            node.val = min_node.val
            node.right = self._delete_recursive(node.right, min_node.val)
        return node

    def _find_min(self, node):
        while node.left:
            node = node.left
        return node

    def inorder(self):
        result = []
        self._inorder_recursive(self.root, result)
        return result

    def _inorder_recursive(self, node, result):
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.val)
            self._inorder_recursive(node.right, result)
`,
      },
      'src/main.py': {
        lang: 'python',
        content: `from bst import BST

tree = BST()
tree.insert(50)
tree.insert(30)
tree.insert(70)
tree.insert(20)

print("In-order traversal:", tree.inorder())
print("Search 30:", tree.search(30))
print("Search 99:", tree.search(99))
tree.delete(30)
print("After deleting 30:", tree.inorder())
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
    integrityReport: null, // Will use mock from IntegrityReport component
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
  { id: 'sub_1', studentName: 'Aditya Deore', status: 'submitted', submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(), score: null },
  { id: 'sub_2', studentName: 'Priya Sharma', status: 'submitted', submittedAt: new Date(Date.now() - 4 * 3600000).toISOString(), score: null },
  { id: 'sub_3', studentName: 'Rahul Kumar', status: 'graded', submittedAt: new Date(Date.now() - 8 * 3600000).toISOString(), score: 82 },
  { id: 'sub_4', studentName: 'Sneha Patel', status: 'graded', submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(), score: 91 },
  { id: 'sub_5', studentName: 'Vikram Singh', status: 'submitted', submittedAt: new Date(Date.now() - 1 * 3600000).toISOString(), score: null },
];

/* ════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════ */

const TeacherReview = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const submissionId = params.get('id') || 'sub_1';

  // ── State ──
  const [submission, setSubmission] = useState(MOCK_SUBMISSIONS[submissionId] || MOCK_SUBMISSIONS.sub_1);
  const [activeFile, setActiveFile] = useState(Object.keys(submission.files)[0]);
  const [activePanel, setActivePanel] = useState('code'); // code | integrity | documents
  const [rubricScores, setRubricScores] = useState(submission.rubric.map(r => ({ ...r })));
  const [lineComments, setLineComments] = useState({});
  const [overallFeedback, setOverallFeedback] = useState('');
  const [showSubmissionList, setShowSubmissionList] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(submissionId);

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

  const currentLang = submission.files[activeFile]?.lang || 'python';

  return (
    <>
      <Helmet><title>Review: {submission.studentName} – CodeCampus</title></Helmet>

      <div className="h-screen flex flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden">
        {/* ════ Title Bar ════ */}
        <div className="h-[36px] bg-[#323233] flex items-center justify-between px-4 flex-shrink-0 border-b border-[#252526]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/assignments')} className="text-[#999] hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={16} />
            </button>
            <div className="flex items-center gap-2">
              <Icon name="GraduationCap" size={16} className="text-blue-400" />
              <span className="text-[12px] text-[#e0e0e0] font-medium">Review:</span>
              <span className="text-[12px] text-white">{submission.studentName}</span>
              <span className="text-[10px] text-[#888]">•</span>
              <span className="text-[11px] text-[#999]">{submission.assignmentTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#888]">
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </span>
            <button
              onClick={() => setShowSubmissionList(!showSubmissionList)}
              className="text-[11px] text-[#999] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Icon name="Users" size={13} />
              All Submissions
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

                {/* Read-only Monaco Editor */}
                <div className="flex-1 min-h-0">
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
              </div>
            )}

            {/* Integrity Panel */}
            {activePanel === 'integrity' && (
              <div className="flex-1 overflow-y-auto p-4">
                <IntegrityReport
                  report={submission.integrityReport}
                  studentName={submission.studentName}
                  assignmentTitle={submission.assignmentTitle}
                  darkMode={true}
                />
              </div>
            )}

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

          {/* ──── Submission List Overlay ──── */}
          {showSubmissionList && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-[#252526] rounded-xl w-full max-w-lg mx-4 border border-[#3c3c3c] shadow-2xl">
                <div className="px-4 py-3 border-b border-[#3c3c3c] flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-white">All Submissions</h3>
                  <button onClick={() => setShowSubmissionList(false)} className="text-[#888] hover:text-white">
                    <Icon name="X" size={16} />
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {MOCK_SUBMISSION_LIST.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubmissionId(sub.id);
                        setShowSubmissionList(false);
                        // In production, would load the submission
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#2a2d2e] transition-colors border-b border-[#3c3c3c] ${
                        selectedSubmissionId === sub.id ? 'bg-[#37373d]' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium ${
                        sub.status === 'graded' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-blue-900/40 text-blue-400'
                      }`}>
                        {sub.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] text-[#ccc]">{sub.studentName}</p>
                        <p className="text-[10px] text-[#888]">{new Date(sub.submittedAt).toLocaleString()}</p>
                      </div>
                      {sub.status === 'graded' ? (
                        <span className="text-[12px] text-emerald-400 font-medium">{sub.score}/100</span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded">Pending</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
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
