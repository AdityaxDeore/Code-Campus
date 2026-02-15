/**
 * ════════════════════════════════════════════════════════════════
 *  Academic Integrity Logging & Monitoring System
 * ════════════════════════════════════════════════════════════════
 *
 *  Tamper-resistant client-side integrity event logging.
 *  All events are hashed, timestamped, and batched for server sync.
 *
 *  Event Types:
 *    paste_detected, paste_blocked, clipboard_copy_blocked,
 *    tab_switch, focus_loss, focus_return, devtools_detected,
 *    ai_suggestion_used, ai_suggestion_dismissed,
 *    code_submitted, exam_started, exam_ended,
 *    fullscreen_exit, right_click_blocked, drag_blocked
 */

// ───────────────────────────────────────────────────────────────
//  Hashing Utility
// ───────────────────────────────────────────────────────────────

const hashString = async (str) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for environments without SubtleCrypto
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
};

// ───────────────────────────────────────────────────────────────
//  Event Types & Severity
// ───────────────────────────────────────────────────────────────

export const INTEGRITY_EVENTS = {
  // Paste events
  PASTE_DETECTED: 'paste_detected',
  PASTE_BLOCKED: 'paste_blocked',
  LARGE_INSERTION: 'large_insertion',

  // Clipboard events
  CLIPBOARD_COPY_BLOCKED: 'clipboard_copy_blocked',
  INTERNAL_CLIPBOARD_COPY: 'internal_clipboard_copy',
  INTERNAL_CLIPBOARD_PASTE: 'internal_clipboard_paste',

  // Focus events
  TAB_SWITCH: 'tab_switch',
  FOCUS_LOSS: 'focus_loss',
  FOCUS_RETURN: 'focus_return',
  RAPID_FOCUS_SWITCH: 'rapid_focus_switch',

  // Security events
  DEVTOOLS_DETECTED: 'devtools_detected',
  RIGHT_CLICK_BLOCKED: 'right_click_blocked',
  DRAG_BLOCKED: 'drag_blocked',
  FULLSCREEN_EXIT: 'fullscreen_exit',
  CONTEXT_MENU_BLOCKED: 'context_menu_blocked',

  // AI events
  AI_SUGGESTION_REQUESTED: 'ai_suggestion_requested',
  AI_SUGGESTION_USED: 'ai_suggestion_used',
  AI_SUGGESTION_DISMISSED: 'ai_suggestion_dismissed',

  // Submission
  CODE_SUBMITTED: 'code_submitted',
  DOCUMENT_SUBMITTED: 'document_submitted',

  // Exam lifecycle
  EXAM_STARTED: 'exam_started',
  EXAM_ENDED: 'exam_ended',
  EXAM_AUTO_SUBMITTED: 'exam_auto_submitted',

  // Typing behaviour
  TYPING_ANOMALY: 'typing_anomaly',
};

export const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

const EVENT_SEVERITY = {
  [INTEGRITY_EVENTS.PASTE_DETECTED]: SEVERITY.WARNING,
  [INTEGRITY_EVENTS.PASTE_BLOCKED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.LARGE_INSERTION]: SEVERITY.CRITICAL,
  [INTEGRITY_EVENTS.CLIPBOARD_COPY_BLOCKED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.INTERNAL_CLIPBOARD_COPY]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.INTERNAL_CLIPBOARD_PASTE]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.TAB_SWITCH]: SEVERITY.WARNING,
  [INTEGRITY_EVENTS.FOCUS_LOSS]: SEVERITY.WARNING,
  [INTEGRITY_EVENTS.FOCUS_RETURN]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.RAPID_FOCUS_SWITCH]: SEVERITY.CRITICAL,
  [INTEGRITY_EVENTS.DEVTOOLS_DETECTED]: SEVERITY.CRITICAL,
  [INTEGRITY_EVENTS.RIGHT_CLICK_BLOCKED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.DRAG_BLOCKED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.FULLSCREEN_EXIT]: SEVERITY.WARNING,
  [INTEGRITY_EVENTS.CONTEXT_MENU_BLOCKED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.AI_SUGGESTION_REQUESTED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.AI_SUGGESTION_USED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.AI_SUGGESTION_DISMISSED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.CODE_SUBMITTED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.DOCUMENT_SUBMITTED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.EXAM_STARTED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.EXAM_ENDED]: SEVERITY.INFO,
  [INTEGRITY_EVENTS.EXAM_AUTO_SUBMITTED]: SEVERITY.CRITICAL,
  [INTEGRITY_EVENTS.TYPING_ANOMALY]: SEVERITY.WARNING,
};

// ───────────────────────────────────────────────────────────────
//  Integrity Logger Class
// ───────────────────────────────────────────────────────────────

class IntegrityLogger {
  constructor() {
    this.events = [];
    this.sessionId = this._generateSessionId();
    this.studentId = null;
    this.assignmentId = null;
    this.examMode = false;
    this._focusLossTimestamps = [];
    this._typingTimestamps = [];
    this._batchQueue = [];
    this._batchTimer = null;
  }

  // ── Initialisation ──

  init({ studentId, assignmentId, examMode = false }) {
    this.studentId = studentId;
    this.assignmentId = assignmentId;
    this.examMode = examMode;
    this.events = [];
    this._focusLossTimestamps = [];
    this._typingTimestamps = [];
    this.sessionId = this._generateSessionId();

    if (examMode) {
      this.log(INTEGRITY_EVENTS.EXAM_STARTED, { examMode: true });
    }
  }

  // ── Core Logging ──

  async log(eventType, metadata = {}) {
    const event = {
      id: this._generateEventId(),
      sessionId: this.sessionId,
      studentId: this.studentId,
      assignmentId: this.assignmentId,
      eventType,
      severity: EVENT_SEVERITY[eventType] || SEVERITY.INFO,
      timestamp: new Date().toISOString(),
      epochMs: Date.now(),
      examMode: this.examMode,
      metadata: { ...metadata },
      fingerprint: null,
    };

    // Generate tamper-resistant fingerprint
    const payload = `${event.sessionId}|${event.eventType}|${event.timestamp}|${JSON.stringify(event.metadata)}`;
    event.fingerprint = await hashString(payload);

    this.events.push(event);
    this._queueForBatch(event);

    return event;
  }

  // ── Paste Event Helpers ──

  async logPaste({ content, charCount, cursorPosition, blocked = false }) {
    const contentHash = await hashString(content || '');
    const eventType = blocked
      ? INTEGRITY_EVENTS.PASTE_BLOCKED
      : INTEGRITY_EVENTS.PASTE_DETECTED;

    return this.log(eventType, {
      characters_pasted: charCount,
      pasted_content_hash: contentHash,
      cursor_position: cursorPosition,
      word_count: (content || '').split(/\s+/).filter(Boolean).length,
    });
  }

  async logLargeInsertion({ charCount, cursorPosition, timeDeltaMs }) {
    return this.log(INTEGRITY_EVENTS.LARGE_INSERTION, {
      characters_inserted: charCount,
      cursor_position: cursorPosition,
      time_delta_ms: timeDeltaMs,
      suspected_paste: timeDeltaMs < 100,
    });
  }

  // ── Focus Event Helpers ──

  logFocusLoss() {
    const now = Date.now();
    this._focusLossTimestamps.push(now);

    // Detect rapid focus switching (3+ switches in 10 seconds)
    const recent = this._focusLossTimestamps.filter(t => now - t < 10000);
    if (recent.length >= 3) {
      this.log(INTEGRITY_EVENTS.RAPID_FOCUS_SWITCH, {
        switches_in_10s: recent.length,
      });
    }

    return this.log(INTEGRITY_EVENTS.FOCUS_LOSS, {
      total_losses: this._focusLossTimestamps.length,
    });
  }

  logFocusReturn() {
    const lastLoss = this._focusLossTimestamps[this._focusLossTimestamps.length - 1];
    const duration = lastLoss ? Date.now() - lastLoss : 0;

    return this.log(INTEGRITY_EVENTS.FOCUS_RETURN, {
      away_duration_ms: duration,
    });
  }

  logTabSwitch() {
    return this.log(INTEGRITY_EVENTS.TAB_SWITCH, {
      total_tab_switches: this.getEventCount(INTEGRITY_EVENTS.TAB_SWITCH) + 1,
    });
  }

  // ── AI Event Helpers ──

  logAiSuggestion({ action, suggestionLength, context }) {
    const eventType = action === 'used'
      ? INTEGRITY_EVENTS.AI_SUGGESTION_USED
      : action === 'dismissed'
        ? INTEGRITY_EVENTS.AI_SUGGESTION_DISMISSED
        : INTEGRITY_EVENTS.AI_SUGGESTION_REQUESTED;

    return this.log(eventType, {
      suggestion_length: suggestionLength,
      context: context?.slice(0, 100),
    });
  }

  // ── Typing Analysis ──

  recordKeystroke() {
    this._typingTimestamps.push(Date.now());
    // Keep only last 100 for analysis
    if (this._typingTimestamps.length > 100) {
      this._typingTimestamps = this._typingTimestamps.slice(-100);
    }
  }

  analyzeTypingPattern() {
    if (this._typingTimestamps.length < 10) return null;

    const intervals = [];
    for (let i = 1; i < this._typingTimestamps.length; i++) {
      intervals.push(this._typingTimestamps[i] - this._typingTimestamps[i - 1]);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    return {
      averageInterval: Math.round(avg),
      stdDeviation: Math.round(stdDev),
      minInterval: Math.min(...intervals),
      maxInterval: Math.max(...intervals),
      sampleSize: intervals.length,
    };
  }

  // ── Report Generation ──

  generateReport() {
    const pasteEvents = this.events.filter(e =>
      [INTEGRITY_EVENTS.PASTE_DETECTED, INTEGRITY_EVENTS.LARGE_INSERTION].includes(e.eventType)
    );
    const blockedPastes = this.events.filter(e => e.eventType === INTEGRITY_EVENTS.PASTE_BLOCKED);
    const focusLosses = this.events.filter(e => e.eventType === INTEGRITY_EVENTS.FOCUS_LOSS);
    const tabSwitches = this.events.filter(e => e.eventType === INTEGRITY_EVENTS.TAB_SWITCH);
    const aiUsed = this.events.filter(e => e.eventType === INTEGRITY_EVENTS.AI_SUGGESTION_USED);
    const aiRequested = this.events.filter(e => e.eventType === INTEGRITY_EVENTS.AI_SUGGESTION_REQUESTED);
    const criticalEvents = this.events.filter(e => e.severity === SEVERITY.CRITICAL);
    const clipboardUses = this.events.filter(e =>
      [INTEGRITY_EVENTS.INTERNAL_CLIPBOARD_COPY, INTEGRITY_EVENTS.INTERNAL_CLIPBOARD_PASTE].includes(e.eventType)
    );

    const typingAnalysis = this.analyzeTypingPattern();

    return {
      sessionId: this.sessionId,
      studentId: this.studentId,
      assignmentId: this.assignmentId,
      examMode: this.examMode,
      generatedAt: new Date().toISOString(),
      summary: {
        totalEvents: this.events.length,
        pasteEventsCount: pasteEvents.length,
        blockedPastesCount: blockedPastes.length,
        suspectedPasteFlags: pasteEvents.filter(e => e.metadata?.suspected_paste).length,
        aiUsageCount: aiUsed.length,
        aiRequestCount: aiRequested.length,
        focusLossEvents: focusLosses.length,
        tabSwitchEvents: tabSwitches.length,
        criticalEventsCount: criticalEvents.length,
        internalClipboardUsage: clipboardUses.length,
        typingPattern: typingAnalysis,
      },
      flags: {
        highPasteActivity: pasteEvents.length > 5,
        excessiveFocusLoss: focusLosses.length > 10,
        suspiciousAiUsage: aiUsed.length > 20,
        rapidFocusSwitching: this.events.some(e => e.eventType === INTEGRITY_EVENTS.RAPID_FOCUS_SWITCH),
        devtoolsDetected: this.events.some(e => e.eventType === INTEGRITY_EVENTS.DEVTOOLS_DETECTED),
        typingAnomalies: typingAnalysis ? typingAnalysis.stdDeviation > 500 : false,
      },
      events: this.events.map(e => ({
        id: e.id,
        eventType: e.eventType,
        severity: e.severity,
        timestamp: e.timestamp,
        metadata: e.metadata,
        fingerprint: e.fingerprint,
      })),
    };
  }

  // ── Counters ──

  getEventCount(eventType) {
    return this.events.filter(e => e.eventType === eventType).length;
  }

  getCriticalCount() {
    return this.events.filter(e => e.severity === SEVERITY.CRITICAL).length;
  }

  getWarningCount() {
    return this.events.filter(e => e.severity === SEVERITY.WARNING).length;
  }

  // ── Serialization ──

  toJSON() {
    return {
      sessionId: this.sessionId,
      studentId: this.studentId,
      assignmentId: this.assignmentId,
      events: this.events,
    };
  }

  // ── Private Helpers ──

  _generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  _generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  _queueForBatch(event) {
    this._batchQueue.push(event);

    // Flush critical events immediately
    if (event.severity === SEVERITY.CRITICAL) {
      this._flushBatch();
      return;
    }

    // Batch normal events (flush every 30 seconds)
    if (!this._batchTimer) {
      this._batchTimer = setTimeout(() => this._flushBatch(), 30000);
    }
  }

  _flushBatch() {
    if (this._batchQueue.length === 0) return;

    // In production, this would POST to the backend
    // For now, store in sessionStorage as backup
    try {
      const key = `integrity_${this.sessionId}`;
      const existing = JSON.parse(sessionStorage.getItem(key) || '[]');
      existing.push(...this._batchQueue);
      sessionStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // sessionStorage full or unavailable — silent fail
    }

    this._batchQueue = [];
    clearTimeout(this._batchTimer);
    this._batchTimer = null;
  }

  destroy() {
    this._flushBatch();
    clearTimeout(this._batchTimer);
  }
}

// ───────────────────────────────────────────────────────────────
//  Singleton Export
// ───────────────────────────────────────────────────────────────

export const integrityLogger = new IntegrityLogger();
export default integrityLogger;
