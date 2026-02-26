/**
 * ════════════════════════════════════════════════════════════════
 *  Assignment Creation Page (Teacher Interface)
 * ════════════════════════════════════════════════════════════════
 *
 *  Allows teachers to create assignments with:
 *    - Code assignments (with starter code, language, test files)
 *    - Document assignments (upload/submit docs)
 *    - Hybrid assignments (code + documents)
 *    - AI policy configuration
 *    - Exam mode toggle
 *    - Rubric builder
 *    - Deadline & max marks
 *    - File attachments
 */

import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { AI_POLICY } from '../../components/AiSuggestionPanel';
import { createAssignment } from '../../lib/assignmentService';
import { useAuth } from '../../hooks/useAuth';

const LANGUAGES = [
  { value: 'python', label: 'Python', icon: 'FileCode' },
  { value: 'javascript', label: 'JavaScript', icon: 'FileJson' },
  { value: 'java', label: 'Java', icon: 'Coffee' },
  { value: 'cpp', label: 'C++', icon: 'FileCode' },
  { value: 'sql', label: 'SQL', icon: 'Database' },
  { value: 'html', label: 'HTML/CSS', icon: 'Globe' },
];

const SUBJECTS = [
  'DSA', 'DBMS', 'OS', 'CN', 'OOP', 'Web Dev', 'AI/ML', 'Cyber Security', 'Software Engineering', 'Other',
];

const ASSIGNMENT_TYPES = [
  { value: 'code', label: 'Code Assignment', desc: 'Students write and submit code', icon: 'Code2' },
  { value: 'document', label: 'Document Submission', desc: 'Students upload documents (PDF, DOCX)', icon: 'FileText' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Code + document submission', icon: 'Layers' },
];

const STARTER_TEMPLATES = {
  python: '# {title}\n# {subject}\n\n# TODO: Implement your solution here\n\ndef solution():\n    pass\n\n\nif __name__ == "__main__":\n    solution()\n',
  javascript: '// {title}\n// {subject}\n\n// TODO: Implement your solution here\n\nfunction solution() {\n  \n}\n\nsolution();\n',
  java: '// {title}\n// {subject}\n\npublic class Solution {\n    // TODO: Implement your solution here\n    \n    public static void main(String[] args) {\n        \n    }\n}\n',
  cpp: '// {title}\n// {subject}\n\n#include <iostream>\nusing namespace std;\n\n// TODO: Implement your solution here\n\nint main() {\n    \n    return 0;\n}\n',
  sql: '-- {title}\n-- {subject}\n\n-- TODO: Write your SQL queries here\n\n',
  html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>{title}</title>\n    <style>\n        /* TODO: Add your styles */\n    </style>\n</head>\n<body>\n    <!-- TODO: Add your HTML -->\n    \n    <script>\n        // TODO: Add your JavaScript\n    </script>\n</body>\n</html>\n',
};

const AssignmentCreation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Form State ──
  const [formData, setFormData] = useState({
    title: '',
    subject: 'DSA',
    type: 'code',
    language: 'python',
    description: '',
    instructions: '',
    maxMarks: 100,
    deadline: '',
    deadlineTime: '23:59',
    examMode: false,
    aiPolicy: AI_POLICY.STANDARD,
    maxAiSuggestions: 20,
    pastePolicy: 'warn',
    allowedLanguages: ['python'],
    starterCode: '',
    testCases: '',
    rubric: [
      { criterion: '', maxScore: 0 },
    ],
    attachments: [],
    allowedFileTypes: ['.pdf', '.docx', '.txt', '.png', '.jpg', '.csv', '.zip'],
    maxFileSize: 10, // MB
    publishImmediately: false,
  });

  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  // ── Update field ──
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  }, []);

  // ── Generate starter code ──
  const generateStarterCode = useCallback(() => {
    const template = STARTER_TEMPLATES[formData.language] || STARTER_TEMPLATES.python;
    const code = template
      .replace(/{title}/g, formData.title || 'Untitled Assignment')
      .replace(/{subject}/g, formData.subject);
    updateField('starterCode', code);
  }, [formData.language, formData.title, formData.subject, updateField]);

  // ── Add rubric row ──
  const addRubricRow = () => {
    setFormData(prev => ({
      ...prev,
      rubric: [...prev.rubric, { criterion: '', maxScore: 0 }],
    }));
  };

  const updateRubricRow = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      rubric: prev.rubric.map((r, i) => i === index ? { ...r, [field]: value } : r),
    }));
  };

  const removeRubricRow = (index) => {
    setFormData(prev => ({
      ...prev,
      rubric: prev.rubric.filter((_, i) => i !== index),
    }));
  };

  // ── Validate step ──
  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!formData.title.trim()) errs.title = 'Title is required';
      if (!formData.description.trim()) errs.description = 'Description is required';
    }
    if (s === 2) {
      if (!formData.deadline) errs.deadline = 'Deadline is required';
    }
    if (s === 3) {
      if (formData.type === 'code' && !formData.starterCode.trim()) {
        errs.starterCode = 'Starter code is required';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Next step ──
  const nextStep = () => {
    if (validateStep(step)) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // ── Handle submission (saves to MongoDB via API) ──
  const handleCreate = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);

    try {
      const assignmentData = {
        title: formData.title,
        course: formData.subject,
        subject: formData.subject.toLowerCase().replace(/[\s\/]/g, '_'),
        instructions: formData.instructions || formData.description,
        assignmentType: formData.type,
        allowedLanguages: formData.allowedLanguages,
        starterCode: formData.starterCode,
        deadline: `${formData.deadline}T${formData.deadlineTime}`,
        aiPolicy: formData.aiPolicy === AI_POLICY.DISABLED ? 'disabled' : formData.aiPolicy === AI_POLICY.LIMITED ? 'limited' : 'enabled',
        examMode: formData.examMode,
        rubric: JSON.stringify(formData.rubric),
        maxMarks: formData.maxMarks,
        difficulty: 'Medium',
        status: formData.publishImmediately ? 'active' : 'draft'
      };

      const result = await createAssignment(
        assignmentData,
        user?.uid || 'teacher_local',
        user?.displayName || 'Teacher'
      );

      if (result.success) {
        alert('✅ Assignment created and saved to database!');
        navigate('/assignments');
      } else {
        alert('❌ Failed to create assignment: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Total rubric marks ──
  const totalRubricMarks = formData.rubric.reduce((sum, r) => sum + (parseInt(r.maxScore) || 0), 0);

  return (
    <>
      <Helmet><title>Create Assignment – CodeCampus</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/assignments')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                <Icon name="ArrowLeft" size={18} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Create Assignment</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Step {step} of {totalSteps}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Icon name="Eye" size={14} className="inline mr-1" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-2 mb-8">
            {['Basics', 'Settings', 'Content', 'Review'].map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i + 1 <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {i + 1 < step ? <Icon name="Check" size={14} /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${
                    i + 1 <= step ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400'
                  }`}>{label}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">

            {/* ═══ Step 1: Basics ═══ */}
            {step === 1 && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Assignment Basics</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Set up the core details of your assignment</p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => updateField('title', e.target.value)}
                    placeholder="e.g. Binary Search Tree Implementation"
                    className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assignment Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ASSIGNMENT_TYPES.map(t => (
                      <button
                        key={t.value}
                        onClick={() => updateField('type', t.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.type === t.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Icon name={t.icon} size={20} className={formData.type === t.value ? 'text-blue-600' : 'text-gray-400'} />
                        <p className={`text-sm font-medium mt-2 ${formData.type === t.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {t.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject & Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={e => updateField('subject', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {(formData.type === 'code' || formData.type === 'hybrid') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Language</label>
                      <select
                        value={formData.language}
                        onChange={e => updateField('language', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    placeholder="Describe the assignment objectives, expected deliverables, and grading criteria..."
                    rows={4}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Detailed Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={e => updateField('instructions', e.target.value)}
                    placeholder="Step-by-step instructions for completing the assignment..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* ═══ Step 2: Settings ═══ */}
            {step === 2 && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Assignment Settings</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure grading, deadlines, and security policies</p>
                </div>

                {/* Marks & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Marks</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxMarks}
                      onChange={e => updateField('maxMarks', parseInt(e.target.value) || 100)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deadline Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={e => updateField('deadline', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${errors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    />
                    {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline Time</label>
                    <input
                      type="time"
                      value={formData.deadlineTime}
                      onChange={e => updateField('deadlineTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Icon name="Shield" size={16} className="text-blue-500" />
                    Security & Integrity
                  </h3>

                  {/* Exam Mode */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exam Mode</p>
                      <p className="text-xs text-gray-500">Fullscreen lockdown, tab switch detection, auto-submit on violations</p>
                    </div>
                    <button
                      onClick={() => updateField('examMode', !formData.examMode)}
                      className={`w-11 h-6 rounded-full transition-colors ${
                        formData.examMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        formData.examMode ? 'translate-x-[22px]' : 'translate-x-[2px]'
                      }`} />
                    </button>
                  </div>

                  {/* Paste Policy */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paste Detection Policy</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'allow', label: 'Allow', desc: 'Log only' },
                        { value: 'warn', label: 'Warn', desc: 'Alert student' },
                        { value: 'block', label: 'Block', desc: 'Prevent paste' },
                      ].map(p => (
                        <button
                          key={p.value}
                          onClick={() => updateField('pastePolicy', p.value)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            formData.pastePolicy === p.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{p.label}</p>
                          <p className="text-[10px] text-gray-500">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Policy */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Assistance Policy</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { value: AI_POLICY.DISABLED, label: 'Disabled', desc: 'No AI' },
                        { value: AI_POLICY.HINTS_ONLY, label: 'Hints Only', desc: 'No code' },
                        { value: AI_POLICY.LIMITED, label: 'Limited', desc: 'Max uses' },
                        { value: AI_POLICY.STANDARD, label: 'Standard', desc: 'Full access' },
                      ].map(p => (
                        <button
                          key={p.value}
                          onClick={() => updateField('aiPolicy', p.value)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            formData.aiPolicy === p.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{p.label}</p>
                          <p className="text-[10px] text-gray-500">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                    {formData.aiPolicy === AI_POLICY.LIMITED && (
                      <div className="mt-2">
                        <label className="text-xs text-gray-500">Max AI suggestions per student</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={formData.maxAiSuggestions}
                          onChange={e => updateField('maxAiSuggestions', parseInt(e.target.value) || 5)}
                          className="ml-2 w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Rubric */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Icon name="ClipboardList" size={16} className="text-emerald-500" />
                      Grading Rubric
                      {totalRubricMarks > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          totalRubricMarks === formData.maxMarks
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        }`}>
                          {totalRubricMarks}/{formData.maxMarks}
                        </span>
                      )}
                    </h3>
                    <button onClick={addRubricRow} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Icon name="Plus" size={14} /> Add Criterion
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.rubric.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={row.criterion}
                          onChange={e => updateRubricRow(i, 'criterion', e.target.value)}
                          placeholder={`Criterion ${i + 1}`}
                          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                        <input
                          type="number"
                          min="0"
                          value={row.maxScore}
                          onChange={e => updateRubricRow(i, 'maxScore', e.target.value)}
                          className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          placeholder="Score"
                        />
                        <button onClick={() => removeRubricRow(i)} className="text-gray-400 hover:text-red-500">
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Step 3: Content ═══ */}
            {step === 3 && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Assignment Content</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.type === 'code' && 'Add starter code and test cases'}
                    {formData.type === 'document' && 'Configure document submission settings'}
                    {formData.type === 'hybrid' && 'Configure code and document requirements'}
                  </p>
                </div>

                {/* Starter Code (for code / hybrid) */}
                {(formData.type === 'code' || formData.type === 'hybrid') && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Starter Code <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={generateStarterCode}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Icon name="Wand2" size={12} /> Generate Template
                      </button>
                    </div>
                    <textarea
                      value={formData.starterCode}
                      onChange={e => updateField('starterCode', e.target.value)}
                      placeholder="Paste or type starter code..."
                      rows={12}
                      className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                        errors.starterCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-gray-900 text-green-400 resize-none`}
                      spellCheck={false}
                    />
                    {errors.starterCode && <p className="mt-1 text-sm text-red-500">{errors.starterCode}</p>}
                  </div>
                )}

                {/* Test Cases */}
                {(formData.type === 'code' || formData.type === 'hybrid') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Test Cases (Optional)
                    </label>
                    <textarea
                      value={formData.testCases}
                      onChange={e => updateField('testCases', e.target.value)}
                      placeholder="Add test cases that will be run against student submissions..."
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-900 text-green-400 font-mono text-sm resize-none"
                      spellCheck={false}
                    />
                  </div>
                )}

                {/* Document Settings (for document / hybrid) */}
                {(formData.type === 'document' || formData.type === 'hybrid') && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Icon name="Upload" size={16} className="text-purple-500" />
                      Document Submission Settings
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Allowed File Types</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['.pdf', '.docx', '.txt', '.png', '.jpg', '.csv', '.zip', '.xlsx'].map(ext => (
                            <button
                              key={ext}
                              onClick={() => {
                                const current = formData.allowedFileTypes;
                                updateField('allowedFileTypes',
                                  current.includes(ext)
                                    ? current.filter(e => e !== ext)
                                    : [...current, ext]
                                );
                              }}
                              className={`px-2 py-1 text-xs rounded border transition-colors ${
                                formData.allowedFileTypes.includes(ext)
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-500'
                              }`}
                            >
                              {ext}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Max File Size (MB)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={formData.maxFileSize}
                          onChange={e => updateField('maxFileSize', parseInt(e.target.value) || 10)}
                          className="w-24 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teacher Attachments
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Upload reference materials, problem PDFs, or datasets</p>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Icon name="Upload" size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click or drag files to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, images, datasets (max 10 MB each)</p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Step 4: Review ═══ */}
            {step === 4 && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Review & Publish</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Review your assignment before publishing</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Details</h4>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-500 mt-1">{formData.subject} • {ASSIGNMENT_TYPES.find(t => t.value === formData.type)?.label}</p>
                    {(formData.type === 'code' || formData.type === 'hybrid') && (
                      <p className="text-xs text-gray-500">{LANGUAGES.find(l => l.value === formData.language)?.label}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Grading</h4>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.maxMarks} marks</p>
                    <p className="text-xs text-gray-500 mt-1">{formData.rubric.filter(r => r.criterion).length} rubric criteria</p>
                    <p className="text-xs text-gray-500">
                      Deadline: {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : 'Not set'} {formData.deadlineTime}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Security</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Icon name={formData.examMode ? 'CheckCircle2' : 'Circle'} size={12} className={formData.examMode ? 'text-emerald-500' : 'text-gray-400'} />
                        Exam Mode {formData.examMode ? 'Enabled' : 'Disabled'}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Icon name="Shield" size={12} className="text-blue-500" />
                        Paste: {formData.pastePolicy}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Icon name="Sparkles" size={12} className="text-indigo-500" />
                        AI: {formData.aiPolicy}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Content</h4>
                    <div className="space-y-1">
                      {(formData.type === 'code' || formData.type === 'hybrid') && (
                        <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <Icon name="Code2" size={12} className="text-emerald-500" />
                          {formData.starterCode ? `${formData.starterCode.split('\n').length} lines starter code` : 'No starter code'}
                        </p>
                      )}
                      <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Icon name="FileText" size={12} className="text-gray-400" />
                        {formData.description.length} char description
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Preview */}
                {formData.description && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description Preview</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}

                {/* Publish Options */}
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Publish immediately?</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Students will see this assignment right away</p>
                  </div>
                  <button
                    onClick={() => updateField('publishImmediately', !formData.publishImmediately)}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      formData.publishImmediately ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      formData.publishImmediately ? 'translate-x-[22px]' : 'translate-x-[2px]'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ Navigation ═══ */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Icon name="ChevronLeft" size={16} /> Back
              </button>
              {step < totalSteps ? (
                <Button onClick={nextStep} className="flex items-center gap-1">
                  Next <Icon name="ChevronRight" size={16} />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { updateField('publishImmediately', false); handleCreate(); }}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <Button onClick={handleCreate}>
                    <Icon name="Send" size={14} className="inline mr-1" />
                    {formData.publishImmediately ? 'Publish' : 'Create Assignment'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentCreation;
