/**
 * ════════════════════════════════════════════════════════════════
 *  Integrity Report Component
 * ════════════════════════════════════════════════════════════════
 *
 *  Displays a comprehensive integrity report for a submission:
 *    - Summary stats (pastes, focus loss, AI usage, etc.)
 *    - Flag indicators
 *    - Event timeline
 *    - Typing pattern analysis
 *    - Exportable to JSON
 */

import React, { useState, useMemo } from 'react';
import Icon from './AppIcon';

const SEVERITY_COLORS = {
  info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', icon: 'Info' },
  warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', icon: 'AlertTriangle' },
  critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', icon: 'AlertOctagon' },
};

const EVENT_LABELS = {
  paste_detected: 'Paste Detected',
  paste_blocked: 'Paste Blocked',
  large_insertion: 'Large Insertion',
  clipboard_copy_blocked: 'Copy Blocked',
  internal_clipboard_copy: 'Internal Copy',
  internal_clipboard_paste: 'Internal Paste',
  tab_switch: 'Tab Switch',
  focus_loss: 'Focus Lost',
  focus_return: 'Focus Returned',
  rapid_focus_switch: 'Rapid Switching',
  devtools_detected: 'DevTools Detected',
  right_click_blocked: 'Right Click',
  drag_blocked: 'Drag Blocked',
  fullscreen_exit: 'Fullscreen Exit',
  context_menu_blocked: 'Context Menu',
  ai_suggestion_requested: 'AI Request',
  ai_suggestion_used: 'AI Used',
  ai_suggestion_dismissed: 'AI Dismissed',
  code_submitted: 'Code Submitted',
  document_submitted: 'Doc Submitted',
  exam_started: 'Exam Started',
  exam_ended: 'Exam Ended',
  exam_auto_submitted: 'Auto-Submitted',
  typing_anomaly: 'Typing Anomaly',
};

const IntegrityReport = ({
  report,
  studentName = 'Student',
  assignmentTitle = 'Assignment',
  darkMode = false,
  onExport,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const bgColor = darkMode ? 'bg-[#1e1e1e]' : 'bg-white';
  const cardBg = darkMode ? 'bg-[#252526]' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-[#3c3c3c]' : 'border-gray-200';
  const textColor = darkMode ? 'text-[#ccc]' : 'text-gray-700';
  const mutedColor = darkMode ? 'text-[#888]' : 'text-gray-500';

  // Parse report or use mock
  const data = useMemo(() => {
    if (report) return report;
    // Mock report for demonstration
    return {
      sessionId: 'session_mock_12345',
      studentId: 'student_001',
      assignmentId: 'asg_001',
      examMode: true,
      generatedAt: new Date().toISOString(),
      summary: {
        totalEvents: 24,
        pasteEventsCount: 3,
        blockedPastesCount: 1,
        suspectedPasteFlags: 1,
        aiUsageCount: 5,
        aiRequestCount: 8,
        focusLossEvents: 4,
        tabSwitchEvents: 2,
        criticalEventsCount: 1,
        internalClipboardUsage: 7,
        typingPattern: {
          averageInterval: 185,
          stdDeviation: 92,
          minInterval: 23,
          maxInterval: 3420,
          sampleSize: 87,
        },
      },
      flags: {
        highPasteActivity: false,
        excessiveFocusLoss: false,
        suspiciousAiUsage: false,
        rapidFocusSwitching: false,
        devtoolsDetected: false,
        typingAnomalies: false,
      },
      events: [
        { id: 'evt_1', eventType: 'exam_started', severity: 'info', timestamp: new Date(Date.now() - 3600000).toISOString(), metadata: { examMode: true } },
        { id: 'evt_2', eventType: 'paste_detected', severity: 'warning', timestamp: new Date(Date.now() - 3200000).toISOString(), metadata: { characters_pasted: 45, word_count: 8 } },
        { id: 'evt_3', eventType: 'ai_suggestion_requested', severity: 'info', timestamp: new Date(Date.now() - 2800000).toISOString(), metadata: { context: 'How do I implement...' } },
        { id: 'evt_4', eventType: 'ai_suggestion_used', severity: 'info', timestamp: new Date(Date.now() - 2750000).toISOString(), metadata: { suggestion_length: 120 } },
        { id: 'evt_5', eventType: 'focus_loss', severity: 'warning', timestamp: new Date(Date.now() - 2400000).toISOString(), metadata: { total_losses: 1 } },
        { id: 'evt_6', eventType: 'focus_return', severity: 'info', timestamp: new Date(Date.now() - 2350000).toISOString(), metadata: { away_duration_ms: 5200 } },
        { id: 'evt_7', eventType: 'tab_switch', severity: 'warning', timestamp: new Date(Date.now() - 1800000).toISOString(), metadata: { total_tab_switches: 1 } },
        { id: 'evt_8', eventType: 'code_submitted', severity: 'info', timestamp: new Date(Date.now() - 600000).toISOString(), metadata: {} },
        { id: 'evt_9', eventType: 'exam_ended', severity: 'info', timestamp: new Date(Date.now() - 300000).toISOString(), metadata: { total_violations: 2 } },
      ],
    };
  }, [report]);

  // ── Risk score ──
  const riskScore = useMemo(() => {
    const flags = data.flags || {};
    let score = 0;
    if (flags.highPasteActivity) score += 25;
    if (flags.excessiveFocusLoss) score += 20;
    if (flags.suspiciousAiUsage) score += 15;
    if (flags.rapidFocusSwitching) score += 20;
    if (flags.devtoolsDetected) score += 40;
    if (flags.typingAnomalies) score += 15;
    return Math.min(100, score);
  }, [data.flags]);

  const riskLevel = riskScore >= 60 ? 'High' : riskScore >= 30 ? 'Medium' : 'Low';
  const riskColor = riskScore >= 60 ? 'text-red-500' : riskScore >= 30 ? 'text-amber-500' : 'text-emerald-500';
  const riskBg = riskScore >= 60 ? 'bg-red-500' : riskScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500';

  // ── Export handler ──
  const handleExport = () => {
    if (onExport) {
      onExport(data);
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integrity_report_${data.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${borderColor} flex items-center justify-between`}>
        <div>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Integrity Report
          </h2>
          <p className={`text-sm ${mutedColor}`}>
            {studentName} • {assignmentTitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Risk Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            riskScore >= 60 ? 'bg-red-100 dark:bg-red-900/30' :
            riskScore >= 30 ? 'bg-amber-100 dark:bg-amber-900/30' :
            'bg-emerald-100 dark:bg-emerald-900/30'
          }`}>
            <Icon name={riskScore >= 60 ? 'AlertOctagon' : riskScore >= 30 ? 'AlertTriangle' : 'ShieldCheck'} size={16} className={riskColor} />
            <span className={`text-sm font-medium ${riskColor}`}>{riskLevel} Risk ({riskScore}%)</span>
          </div>
          <button
            onClick={handleExport}
            className={`p-2 rounded-lg border ${borderColor} ${darkMode ? 'hover:bg-[#3c3c3c]' : 'hover:bg-gray-100'} transition-colors`}
            title="Export Report"
          >
            <Icon name="Download" size={16} className={mutedColor} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${borderColor}`}>
        {[
          { id: 'summary', label: 'Summary', icon: 'BarChart3' },
          { id: 'timeline', label: 'Timeline', icon: 'Clock' },
          { id: 'flags', label: 'Flags', icon: 'Flag' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? `${darkMode ? 'text-white' : 'text-blue-600'} border-blue-600`
                : `${mutedColor} border-transparent hover:${textColor}`
            }`}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* ═══ Summary Tab ═══ */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Paste Events', value: data.summary.pasteEventsCount, icon: 'Clipboard', color: 'text-amber-500' },
                { label: 'Focus Losses', value: data.summary.focusLossEvents, icon: 'EyeOff', color: 'text-orange-500' },
                { label: 'AI Usage', value: data.summary.aiUsageCount, icon: 'Sparkles', color: 'text-indigo-500' },
                { label: 'Critical', value: data.summary.criticalEventsCount, icon: 'AlertOctagon', color: 'text-red-500' },
              ].map((stat, i) => (
                <div key={i} className={`${cardBg} rounded-lg p-3 border ${borderColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={stat.icon} size={14} className={stat.color} />
                    <span className={`text-xs ${mutedColor}`}>{stat.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Risk Meter */}
            <div className={`${cardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${textColor}`}>Risk Assessment</span>
                <span className={`text-sm font-bold ${riskColor}`}>{riskScore}%</span>
              </div>
              <div className={`w-full h-3 ${darkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div className={`h-full ${riskBg} rounded-full transition-all`} style={{ width: `${riskScore}%` }} />
              </div>
            </div>

            {/* Typing Pattern */}
            {data.summary.typingPattern && (
              <div className={`${cardBg} rounded-lg p-4 border ${borderColor}`}>
                <h4 className={`text-sm font-medium ${textColor} mb-3 flex items-center gap-2`}>
                  <Icon name="Keyboard" size={14} className="text-blue-500" />
                  Typing Pattern Analysis
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Avg Interval', value: `${data.summary.typingPattern.averageInterval}ms` },
                    { label: 'Std Deviation', value: `${data.summary.typingPattern.stdDeviation}ms` },
                    { label: 'Sample Size', value: data.summary.typingPattern.sampleSize },
                    { label: 'Min/Max', value: `${data.summary.typingPattern.minInterval}/${data.summary.typingPattern.maxInterval}ms` },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className={`text-xs ${mutedColor}`}>{item.label}</p>
                      <p className={`text-sm font-medium ${textColor}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Info */}
            <div className={`${cardBg} rounded-lg p-4 border ${borderColor}`}>
              <h4 className={`text-sm font-medium ${textColor} mb-2`}>Session Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className={mutedColor}>Session ID:</span> <span className={textColor}>{data.sessionId}</span></div>
                <div><span className={mutedColor}>Generated:</span> <span className={textColor}>{new Date(data.generatedAt).toLocaleString()}</span></div>
                <div><span className={mutedColor}>Total Events:</span> <span className={textColor}>{data.summary.totalEvents}</span></div>
                <div><span className={mutedColor}>Exam Mode:</span> <span className={textColor}>{data.examMode ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Timeline Tab ═══ */}
        {activeTab === 'timeline' && (
          <div className="space-y-1">
            {data.events.map((event, i) => {
              const colors = SEVERITY_COLORS[event.severity] || SEVERITY_COLORS.info;
              const isExpanded = expandedEvent === event.id;

              return (
                <button
                  key={event.id}
                  onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    isExpanded ? colors.bg : `hover:${darkMode ? 'bg-[#2a2d2e]' : 'bg-gray-50'}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${
                        event.severity === 'critical' ? 'bg-red-500' :
                        event.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      {i < data.events.length - 1 && (
                        <div className={`w-px flex-1 mt-1 ${darkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'}`} style={{ minHeight: 8 }} />
                      )}
                    </div>

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${textColor}`}>
                          {EVENT_LABELS[event.eventType] || event.eventType}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                          {event.severity}
                        </span>
                      </div>
                      <p className={`text-xs ${mutedColor}`}>
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={14} className={mutedColor} />
                  </div>

                  {/* Expanded metadata */}
                  {isExpanded && event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className={`mt-2 ml-5 p-2 rounded ${darkMode ? 'bg-[#1e1e1e]' : 'bg-white'} border ${borderColor}`}>
                      <pre className={`text-xs font-mono ${mutedColor} whitespace-pre-wrap`}>
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ═══ Flags Tab ═══ */}
        {activeTab === 'flags' && (
          <div className="space-y-3">
            {Object.entries(data.flags || {}).map(([key, flagged]) => {
              const labels = {
                highPasteActivity: { label: 'High Paste Activity', desc: 'More than 5 paste events detected', icon: 'Clipboard' },
                excessiveFocusLoss: { label: 'Excessive Focus Loss', desc: 'More than 10 focus loss events', icon: 'EyeOff' },
                suspiciousAiUsage: { label: 'Suspicious AI Usage', desc: 'More than 20 AI suggestions used', icon: 'Sparkles' },
                rapidFocusSwitching: { label: 'Rapid Focus Switching', desc: '3+ focus switches in 10 seconds', icon: 'Zap' },
                devtoolsDetected: { label: 'DevTools Detected', desc: 'Browser developer tools were opened', icon: 'Code2' },
                typingAnomalies: { label: 'Typing Anomalies', desc: 'Unusual typing patterns detected', icon: 'Keyboard' },
              };

              const info = labels[key] || { label: key, desc: '', icon: 'Flag' };

              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                    flagged
                      ? darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                      : `${cardBg} ${borderColor}`
                  }`}
                >
                  <Icon
                    name={flagged ? 'AlertTriangle' : 'CheckCircle2'}
                    size={18}
                    className={flagged ? 'text-red-500' : 'text-emerald-500'}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${flagged ? 'text-red-600 dark:text-red-400' : textColor}`}>
                      {info.label}
                    </p>
                    <p className={`text-xs ${mutedColor}`}>{info.desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    flagged
                      ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300'
                      : darkMode ? 'bg-[#3c3c3c] text-[#888]' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {flagged ? 'Flagged' : 'Clear'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrityReport;
