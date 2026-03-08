/**
 * ════════════════════════════════════════════════════════════════
 *  Report Submission Page
 * ════════════════════════════════════════════════════════════════
 *
 *  Students upload a document (PDF, DOCX, TXT) for report-type
 *  assignments. The content is extracted and run through AI detection.
 *  Teachers see the AI detection results on the review page.
 */

import React, { useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import detectAiGenerated from '../../lib/aiDetection';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use worker from public folder
// Vite serves public folder at root, so we can access it directly
pdfjsLib.GlobalWorkerOptions.workerSrc = '/codecampus/pdf.worker.min.mjs';

/* ────────────────────────────────────────────────────────────
   Assignment Data
   ──────────────────────────────────────────────────────────── */
const reportAssignments = {
  a9: {
    title: 'Computer Network FA1 Report',
    subject: 'Computer Networks',
    teacher: 'Prof. Deshmukh',
    deadline: new Date(Date.now() + 72 * 36e5).toISOString(),
    maxMarks: 50,
    description: 'Submit your FA1 report on OSI Model, TCP/IP, and Network Topologies.\n\nYour report should cover:\n1. OSI Model layers and their functions\n2. TCP/IP protocol suite\n3. Network topologies (Star, Bus, Ring, Mesh)\n4. Comparison of OSI and TCP/IP models\n\nFormat: PDF or DOCX, 5–10 pages, properly referenced.',
    allowedTypes: ['.pdf', '.docx', '.txt'],
    maxSizeMB: 15,
  },
};

const defaultReport = {
  title: 'Report Submission',
  subject: 'General',
  teacher: 'Teacher',
  deadline: new Date(Date.now() + 48 * 36e5).toISOString(),
  maxMarks: 50,
  description: 'Upload your report document.',
  allowedTypes: ['.pdf', '.docx', '.txt'],
  maxSizeMB: 15,
};

/* ────────────────────────────────────────────────────────────
   Text Extraction Utilities
   ──────────────────────────────────────────────────────────── */

function extractTextFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

// For PDF/DOCX, we extract what we can client-side
// Real production would use a server-side parser
async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'txt') {
    return extractTextFromTxt(file);
  }

  if (ext === 'pdf') {
    // Read as ArrayBuffer and extract text using PDF.js
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = await extractTextFromPDFBuffer(e.target.result);
          resolve(text);
        } catch (err) {
          console.error('PDF extraction failed:', err);
          resolve('[PDF extraction failed. Please check the console for details or try converting to .txt format.]');
        }
      };
      reader.onerror = () => resolve('[Failed to read PDF file]');
      reader.readAsArrayBuffer(file);
    });
  }

  if (ext === 'docx') {
    // Extract text from DOCX (ZIP containing XML)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = await extractTextFromDocx(e.target.result);
          resolve(text || '[DOCX content could not be fully extracted client-side.]');
        } catch {
          resolve('[DOCX uploaded — server-side extraction needed for full analysis]');
        }
      };
      reader.onerror = () => reject(new Error('Failed to read DOCX'));
      reader.readAsArrayBuffer(file);
    });
  }

  return Promise.resolve('[Unsupported file type for text extraction]');
}

// Proper PDF text extraction using PDF.js
async function extractTextFromPDFBuffer(buffer) {
  try {
    console.log('Starting PDF extraction...');
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
    
    const textBlocks = [];
    const numPages = Math.min(pdf.numPages, 50); // Limit to first 50 pages for performance
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items and join them
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        
        if (pageText.trim()) {
          textBlocks.push(pageText.trim());
        }
      } catch (pageError) {
        console.warn(`Error extracting page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }
    
    const fullText = textBlocks.join('\n\n');
    console.log(`Extracted ${fullText.length} characters from PDF`);
    
    if (fullText.length < 10) {
      return '[PDF appears to be empty or contains only images. Try a text-based PDF or convert to .txt]';
    }
    
    return fullText.slice(0, 15000); // Cap at 15K chars
  } catch (error) {
    console.error('PDF extraction error details:', error);
    // Provide specific error messages based on error type
    if (error.message.includes('Invalid PDF')) {
      return '[Invalid or corrupted PDF file. Please try another file.]';
    } else if (error.message.includes('password')) {
      return '[PDF is password-protected. Please remove password protection first.]';
    } else {
      return `[PDF extraction failed: ${error.message}. Try converting to .txt format.]`;
    }
  }
}

// Basic DOCX text extraction
async function extractTextFromDocx(buffer) {
  // DOCX is a ZIP file; word/document.xml contains the text
  // We'll use the browser's built-in decompression if available
  try {
    const blob = new Blob([buffer], { type: 'application/zip' });
    // Try using the File API approach
    const text = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buffer));

    // Extract text from XML tags
    const xmlContent = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    if (xmlContent) {
      return xmlContent
        .map(tag => tag.replace(/<[^>]+>/g, ''))
        .join(' ')
        .slice(0, 15000);
    }
  } catch { /* fall through */ }

  return '';
}

/* ────────────────────────────────────────────────────────────
   Risk Level Styling
   ──────────────────────────────────────────────────────────── */
const riskStyles = {
  low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800', icon: 'CheckCircle2' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', icon: 'AlertTriangle' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800', icon: 'AlertTriangle' },
  critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800', icon: 'AlertOctagon' },
};

/* ════════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════════ */

export default function ReportSubmission() {
  const [params] = useSearchParams();
  const assignmentId = params.get('id') || 'a9';
  const asg = reportAssignments[assignmentId] || defaultReport;

  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const fileInputRef = useRef(null);

  const deadline = new Date(asg.deadline);
  const hoursLeft = Math.max(0, (deadline - new Date()) / 36e5);

  /* ── File Selection ── */
  const handleFile = useCallback(async (selectedFile) => {
    setError('');
    setAiResult(null);
    setExtractedText('');

    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!asg.allowedTypes.includes(ext)) {
      setError(`File type ${ext} not allowed. Accepted: ${asg.allowedTypes.join(', ')}`);
      return;
    }

    const sizeMB = selectedFile.size / (1024 * 1024);
    if (sizeMB > asg.maxSizeMB) {
      setError(`File too large (${sizeMB.toFixed(1)} MB). Maximum: ${asg.maxSizeMB} MB`);
      return;
    }

    setFile(selectedFile);

    // Extract text for AI analysis
    try {
      const text = await extractTextFromFile(selectedFile);
      setExtractedText(text);
    } catch (err) {
      console.error('Text extraction error:', err);
      setExtractedText('[Could not extract text from file]');
    }
  }, [asg]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const onFileInput = useCallback((e) => {
    const selected = e.target.files[0];
    if (selected) handleFile(selected);
  }, [handleFile]);

  /* ── AI Detection ── */
  const runAiDetection = useCallback(async () => {
    if (!extractedText || extractedText.length < 50) {
      setError('Not enough text extracted for AI detection. Try a .txt file for best results.');
      return;
    }

    setAnalyzing(true);
    setError('');
    try {
      const result = await detectAiGenerated(extractedText, 'text', null);
      setAiResult(result);
    } catch (err) {
      setError(`AI detection failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  }, [extractedText]);

  /* ── Submit ── */
  const handleSubmit = useCallback(() => {
    // Store result for teacher review (in real app, this goes to backend)
    const submission = {
      assignmentId,
      fileName: file.name,
      fileSize: file.size,
      extractedTextLength: extractedText.length,
      aiDetection: aiResult,
      submittedAt: new Date().toISOString(),
    };
    // Save to sessionStorage for teacher-review to pick up
    const key = `report_submission_${assignmentId}`;
    sessionStorage.setItem(key, JSON.stringify(submission));
    setSubmitted(true);
  }, [assignmentId, file, extractedText, aiResult]);

  /* ── Submitted Screen ── */
  if (submitted) {
    return (
      <>
        <Helmet><title>Submitted – CodeCampus</title></Helmet>
        <div className="min-h-screen bg-[#f7f8fa]">
          <Header />
          <div className="pt-16 flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle2" size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">Report Submitted</h2>
              <p className="text-[13px] text-slate-500 mb-1">{asg.title}</p>
              <p className="text-[12px] text-slate-400 mb-1">{file?.name}</p>
              {aiResult && (
                <div className={`inline-block mt-2 mb-3 px-3 py-1 rounded-full text-[12px] font-medium ${riskStyles[aiResult.riskLevel]?.badge || 'bg-slate-100 text-slate-600'}`}>
                  AI Detection: {aiResult.score}% — {aiResult.verdict}
                </div>
              )}
              <div className="mt-4">
                <Link to="/assignments"><Button size="sm">Back to Assignments</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const rs = aiResult ? (riskStyles[aiResult.riskLevel] || riskStyles.low) : null;

  return (
    <>
      <Helmet><title>{asg.title} – CodeCampus</title></Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[800px] mx-auto px-5 py-8">

            {/* Back + Title */}
            <Link to="/assignments" className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 mb-4 transition-colors">
              <Icon name="ArrowLeft" size={14} /> Back to Assignments
            </Link>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>

              {/* ── Header ── */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{asg.subject}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500">{asg.teacher}</span>
                    </div>
                    <h1 className="text-[18px] font-semibold text-slate-900">{asg.title}</h1>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">Deadline</p>
                    <p className={`text-[12px] font-medium ${hoursLeft < 24 ? 'text-red-600' : 'text-slate-600'}`}>
                      {hoursLeft < 24 ? `${Math.ceil(hoursLeft)}h left` : `${Math.ceil(hoursLeft / 24)}d left`}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Max: {asg.maxMarks} marks</p>
                  </div>
                </div>
                <p className="text-[13px] text-slate-600 mt-3 whitespace-pre-line leading-relaxed">{asg.description}</p>
              </div>

              {/* ── Upload Zone ── */}
              <div className="px-6 py-6">
                <h3 className="text-[13px] font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Icon name="Upload" size={14} className="text-blue-600" />
                  Upload Report
                </h3>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging ? 'border-blue-400 bg-blue-50' :
                    file ? 'border-emerald-300 bg-emerald-50/50' :
                    'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={asg.allowedTypes.join(',')}
                    onChange={onFileInput}
                    className="hidden"
                  />

                  {file ? (
                    <div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="FileCheck" size={24} className="text-emerald-600" />
                      </div>
                      <p className="text-[14px] font-medium text-slate-800">{file.name}</p>
                      <p className="text-[12px] text-slate-500 mt-1">
                        {(file.size / 1024).toFixed(0)} KB
                        {extractedText && ` • ${extractedText.length.toLocaleString()} characters extracted`}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setExtractedText(''); setAiResult(null); }}
                        className="mt-2 text-[11px] text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove & upload different file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="CloudUpload" size={24} className="text-slate-400" />
                      </div>
                      <p className="text-[14px] font-medium text-slate-700">Drop your file here or click to browse</p>
                      <p className="text-[12px] text-slate-400 mt-1">
                        Accepted: {asg.allowedTypes.join(', ')} • Max {asg.maxSizeMB} MB
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700 flex items-center gap-2">
                    <Icon name="AlertCircle" size={14} /> {error}
                  </div>
                )}

                {/* Text Preview */}
                {extractedText && extractedText.length > 50 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowTextPreview(p => !p)}
                      className="text-[12px] text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      <Icon name={showTextPreview ? 'ChevronDown' : 'ChevronRight'} size={14} />
                      {showTextPreview ? 'Hide' : 'Preview'} extracted text ({extractedText.length.toLocaleString()} chars)
                    </button>
                    {showTextPreview && (
                      <pre className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 max-h-[200px] overflow-y-auto whitespace-pre-wrap font-mono">
                        {extractedText.slice(0, 3000)}{extractedText.length > 3000 ? '\n\n... (truncated)' : ''}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* ── AI Detection Section ── */}
              <div className="px-6 py-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <Icon name="Shield" size={14} className="text-indigo-600" />
                    AI Content Detection
                  </h3>
                  <button
                    onClick={runAiDetection}
                    disabled={!file || !extractedText || analyzing}
                    className={`px-4 py-2 text-[12px] font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      analyzing ? 'bg-indigo-100 text-indigo-500 cursor-wait' :
                      !file ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                      'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {analyzing ? (
                      <><Icon name="Loader2" size={13} className="animate-spin" /> Analyzing...</>
                    ) : (
                      <><Icon name="ScanSearch" size={13} /> Scan for AI Content</>
                    )}
                  </button>
                </div>

                {/* Results */}
                {aiResult && (
                  <div className={`rounded-xl border p-5 ${rs.bg} ${rs.border}`}>
                    {/* Score Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${aiResult.score >= 50 ? 'bg-red-100' : aiResult.score >= 25 ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                          <span className={`text-[18px] font-bold ${aiResult.score >= 50 ? 'text-red-700' : aiResult.score >= 25 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {aiResult.score}%
                          </span>
                        </div>
                        <div>
                          <p className={`text-[15px] font-semibold ${rs.text}`}>{aiResult.verdict}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">AI Probability Score</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${rs.badge}`}>
                        {aiResult.riskLevel.toUpperCase()}
                      </span>
                    </div>

                    {/* Breakdown Bars */}
                    <div className="space-y-3 mb-4">
                      {[
                        { label: 'Heuristic Analysis', ...aiResult.breakdown.heuristic },
                        { label: 'Gemini AI Analysis', ...aiResult.breakdown.gemini },
                      ].map((layer, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-600 font-medium">{layer.label}</span>
                            <span className="text-slate-500">{layer.score}/{layer.maxScore}</span>
                          </div>
                          <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                layer.score / layer.maxScore > 0.6 ? 'bg-red-500' :
                                layer.score / layer.maxScore > 0.3 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${(layer.score / layer.maxScore) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gemini Reasoning */}
                    {aiResult.breakdown.gemini?.reasoning && (
                      <div className="bg-white/60 rounded-lg p-3 mb-4 border border-white/80">
                        <p className="text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                          <Icon name="Sparkles" size={12} className="text-indigo-500" /> Gemini Analysis
                        </p>
                        <p className="text-[12px] text-slate-700 leading-relaxed">{aiResult.breakdown.gemini.reasoning}</p>
                      </div>
                    )}

                    {/* Signals */}
                    {aiResult.allSignals.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-slate-600 mb-2">Detected Signals ({aiResult.allSignals.length})</p>
                        <div className="space-y-1.5">
                          {aiResult.allSignals.filter(s => s.weight > 0).map((signal, i) => (
                            <div key={i} className="flex items-start gap-2 bg-white/50 rounded-lg px-3 py-2">
                              <Icon
                                name={signal.weight >= 10 ? 'AlertOctagon' : signal.weight >= 5 ? 'AlertTriangle' : 'Info'}
                                size={13}
                                className={signal.weight >= 10 ? 'text-red-500 mt-0.5' : signal.weight >= 5 ? 'text-amber-500 mt-0.5' : 'text-blue-400 mt-0.5'}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] text-slate-700">{signal.detail}</p>
                                <p className="text-[10px] text-slate-400 capitalize">{signal.type.replace(/_/g, ' ')}</p>
                              </div>
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                signal.weight >= 10 ? 'bg-red-100 text-red-700' :
                                signal.weight >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                +{signal.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!aiResult && !analyzing && file && (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
                    <Icon name="ScanSearch" size={28} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-[13px] text-slate-500">Click "Scan for AI Content" to check your report</p>
                    <p className="text-[11px] text-slate-400 mt-1">Uses heuristic rules + Gemini AI to detect AI-generated content</p>
                  </div>
                )}
              </div>

              {/* ── Submit ── */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  {aiResult
                    ? `AI Score: ${aiResult.score}% (${aiResult.verdict})`
                    : 'Run AI detection before submitting (recommended)'
                  }
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={!file}
                  className={`px-5 py-2.5 text-[13px] font-medium rounded-lg transition-all flex items-center gap-2 ${
                    !file ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                    'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  }`}
                >
                  <Icon name="Send" size={14} /> Submit Report
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
