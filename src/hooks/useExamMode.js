/**
 * ════════════════════════════════════════════════════════════════
 *  Exam Mode Security Hook
 * ════════════════════════════════════════════════════════════════
 *
 *  Enforces academic integrity during proctored exams:
 *    - Fullscreen enforcement
 *    - Tab switch / focus loss detection
 *    - DevTools detection
 *    - Right-click / context menu blocking
 *    - Drag & drop blocking
 *    - Copy / paste interception
 *    - Max violations → auto-submit
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import integrityLogger, { INTEGRITY_EVENTS } from '../lib/integrity';

const DEFAULT_MAX_VIOLATIONS = 3;
const DEVTOOLS_CHECK_INTERVAL = 2000;

export const useExamMode = ({
  enabled = false,
  maxViolations = DEFAULT_MAX_VIOLATIONS,
  onAutoSubmit = null,
  allowInternalClipboard = true,
  studentId = null,
  assignmentId = null,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const devtoolsTimerRef = useRef(null);
  const autoSubmitTriggered = useRef(false);

  // ── Total violation count ──
  const totalViolations = violations.length;
  const remainingWarnings = Math.max(0, maxViolations - totalViolations);

  // ── Add violation ──
  const addViolation = useCallback((type, message) => {
    const violation = {
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    setViolations(prev => {
      const updated = [...prev, violation];

      // Auto-submit on max violations
      if (updated.length >= maxViolations && !autoSubmitTriggered.current) {
        autoSubmitTriggered.current = true;
        integrityLogger.log(INTEGRITY_EVENTS.EXAM_AUTO_SUBMITTED, {
          total_violations: updated.length,
          violation_types: updated.map(v => v.type),
        });
        setTimeout(() => onAutoSubmit?.(), 500);
      }

      return updated;
    });

    setWarningMessage(message);
    setShowWarningModal(true);
    setTimeout(() => setShowWarningModal(false), 4000);
  }, [maxViolations, onAutoSubmit]);

  // ── Enter Fullscreen + Keyboard Lock ──
  const enterFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      setIsFullscreen(true);

      // Keyboard Lock API: captures Escape, F11, Alt+Tab at OS level (Chromium)
      if (navigator.keyboard && navigator.keyboard.lock) {
        try {
          await navigator.keyboard.lock(['Escape', 'F11']);
        } catch (lockErr) {
          console.warn('Keyboard lock not supported:', lockErr.message);
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err.message);
    }
  }, []);

  // ── Exit Fullscreen + Keyboard Unlock ──
  const exitFullscreen = useCallback(() => {
    try {
      // Release keyboard lock
      if (navigator.keyboard && navigator.keyboard.unlock) {
        navigator.keyboard.unlock();
      }
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    } catch {
      // ignore
    }
  }, []);

  // ── Start Exam Mode ──
  const startExamMode = useCallback(() => {
    if (!enabled) return;

    integrityLogger.init({
      studentId,
      assignmentId,
      examMode: true,
    });

    setIsActive(true);
    setViolations([]);
    setTabSwitchCount(0);
    setFocusLossCount(0);
    autoSubmitTriggered.current = false;
    enterFullscreen();
  }, [enabled, studentId, assignmentId, enterFullscreen]);

  // ── End Exam Mode ──
  const endExamMode = useCallback(() => {
    setIsActive(false);
    exitFullscreen();
    integrityLogger.log(INTEGRITY_EVENTS.EXAM_ENDED, {
      total_violations: violations.length,
    });
    integrityLogger.destroy();
  }, [violations.length, exitFullscreen]);

  // ── Fullscreen change listener ──
  useEffect(() => {
    if (!isActive) return;

    const handler = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);

      if (!fs && isActive) {
        integrityLogger.log(INTEGRITY_EVENTS.FULLSCREEN_EXIT);
        addViolation('fullscreen_exit', 'You exited fullscreen mode. Please stay in fullscreen during the exam.');
        // Re-enter fullscreen
        setTimeout(() => enterFullscreen(), 1000);
      }
    };

    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, [isActive, addViolation, enterFullscreen]);

  // ── Tab visibility / focus ──
  useEffect(() => {
    if (!isActive) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        integrityLogger.logTabSwitch();
        addViolation('tab_switch', `Tab switch detected! ${remainingWarnings - 1} warning(s) remaining before auto-submit.`);
      }
    };

    const handleFocusLoss = () => {
      setFocusLossCount(prev => prev + 1);
      integrityLogger.logFocusLoss();
      addViolation('focus_loss', 'Window focus lost (Alt+Tab detected). Do not leave the exam window.');
    };

    const handleFocusReturn = () => {
      integrityLogger.logFocusReturn();
      // Force back into fullscreen when they return
      if (!document.fullscreenElement) {
        setTimeout(() => enterFullscreen(), 200);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleFocusLoss);
    window.addEventListener('focus', handleFocusReturn);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleFocusLoss);
      window.removeEventListener('focus', handleFocusReturn);
    };
  }, [isActive, addViolation, remainingWarnings, enterFullscreen]);

  // ── Block context menu / right-click ──
  useEffect(() => {
    if (!isActive) return;

    const blockContextMenu = (e) => {
      e.preventDefault();
      integrityLogger.log(INTEGRITY_EVENTS.RIGHT_CLICK_BLOCKED);
    };

    const blockDrag = (e) => {
      e.preventDefault();
      integrityLogger.log(INTEGRITY_EVENTS.DRAG_BLOCKED);
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('dragstart', blockDrag);
    document.addEventListener('drop', blockDrag);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('dragstart', blockDrag);
      document.removeEventListener('drop', blockDrag);
    };
  }, [isActive]);

  // ── Block keyboard shortcuts ──
  useEffect(() => {
    if (!isActive) return;

    const blockShortcuts = (e) => {
      // Block Ctrl+C/V/X unless internal clipboard is allowed
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        if (!allowInternalClipboard) {
          e.preventDefault();
          integrityLogger.log(INTEGRITY_EVENTS.CLIPBOARD_COPY_BLOCKED);
        }
      }

      // Block F12, Ctrl+Shift+I (DevTools)
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        integrityLogger.log(INTEGRITY_EVENTS.DEVTOOLS_DETECTED);
      }

      // Block Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }

      // Block Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
      }

      // Block Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }

      // Block F11 (browser fullscreen toggle) — Keyboard Lock handles this at OS level,
      // but we still preventDefault as a fallback for non-Chromium browsers
      if (e.key === 'F11') {
        e.preventDefault();
        e.stopImmediatePropagation();
        addViolation('f11_blocked', 'F11 is disabled during the exam. Stay in the exam window.');
      }

      // Block Escape — Keyboard Lock captures this at OS level in Chromium.
      // Fallback: preventDefault + force re-enter fullscreen
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        addViolation('escape_blocked', 'Escape is disabled during the exam. You cannot exit fullscreen.');
        setTimeout(() => enterFullscreen(), 100);
      }

      // Block Alt key combos (Alt+Tab, Alt+F4, etc.)
      if (e.altKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (e.key === 'Tab') {
          addViolation('alt_tab_blocked', 'Alt+Tab is disabled during the exam. Do not switch windows.');
        } else if (e.key === 'F4') {
          addViolation('alt_f4_blocked', 'Alt+F4 is disabled during the exam. You cannot close the window.');
        }
      }

      // Block Tab alone to prevent focus escaping
      if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
        // Allow Tab only inside the code editor, block elsewhere
        const target = e.target;
        const isEditor = target?.closest?.('.monaco-editor') || target?.tagName === 'TEXTAREA';
        if (!isEditor) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', blockShortcuts, true);
    return () => document.removeEventListener('keydown', blockShortcuts, true);
  }, [isActive, allowInternalClipboard, addViolation, enterFullscreen]);

  // ── Block window close / refresh ──
  useEffect(() => {
    if (!isActive) return;

    const blockUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You are in an exam. Leaving will count as a violation.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', blockUnload);
    return () => window.removeEventListener('beforeunload', blockUnload);
  }, [isActive]);

  // ── DevTools detection ──
  useEffect(() => {
    if (!isActive) return;

    const checkDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devtoolsOpen) {
          setDevtoolsOpen(true);
          integrityLogger.log(INTEGRITY_EVENTS.DEVTOOLS_DETECTED, {
            width_diff: widthDiff,
            height_diff: heightDiff,
          });
          addViolation('devtools', 'DevTools detected! This is not allowed during exams.');
        }
      } else {
        setDevtoolsOpen(false);
      }
    };

    devtoolsTimerRef.current = setInterval(checkDevTools, DEVTOOLS_CHECK_INTERVAL);
    return () => clearInterval(devtoolsTimerRef.current);
  }, [isActive, devtoolsOpen, addViolation]);

  // ── Dismiss warning ──
  const dismissWarning = useCallback(() => {
    setShowWarningModal(false);
  }, []);

  return {
    isActive,
    isFullscreen,
    violations,
    totalViolations,
    remainingWarnings,
    tabSwitchCount,
    focusLossCount,
    devtoolsOpen,
    showWarningModal,
    warningMessage,
    startExamMode,
    endExamMode,
    enterFullscreen,
    dismissWarning,
  };
};

export default useExamMode;
