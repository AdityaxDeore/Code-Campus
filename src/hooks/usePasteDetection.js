/**
 * ════════════════════════════════════════════════════════════════
 *  Paste Detection Hook
 * ════════════════════════════════════════════════════════════════
 *
 *  Detects and logs paste events with configurable policies:
 *    - Word count threshold detection
 *    - Character count threshold detection
 *    - Large insertion detection (rapid typing spikes)
 *    - Content hashing (privacy-preserving)
 *    - Policy-based blocking (allow / warn / block)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import integrityLogger from '../lib/integrity';

export const PASTE_POLICY = {
  ALLOW: 'allow',       // Allow paste, log it
  WARN: 'warn',         // Allow paste, show warning, log it
  BLOCK: 'block',       // Block paste entirely, log attempt
};

const DEFAULT_WORD_THRESHOLD = 10;
const DEFAULT_CHAR_THRESHOLD = 100;
const LARGE_INSERTION_CHARS = 50;
const LARGE_INSERTION_TIME_MS = 200;

export const usePasteDetection = ({
  enabled = true,
  policy = PASTE_POLICY.WARN,
  wordThreshold = DEFAULT_WORD_THRESHOLD,
  charThreshold = DEFAULT_CHAR_THRESHOLD,
  onPasteDetected = null,
  onPasteBlocked = null,
} = {}) => {
  const [pasteEvents, setPasteEvents] = useState([]);
  const [lastPasteTime, setLastPasteTime] = useState(null);
  const [totalPastedChars, setTotalPastedChars] = useState(0);
  const lastContentLengthRef = useRef(0);
  const lastChangeTimeRef = useRef(Date.now());

  // ── Handle paste event ──
  const handlePaste = useCallback((e) => {
    if (!enabled) return;

    const pastedText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    const wordCount = pastedText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = pastedText.length;

    const isFlagged = wordCount > wordThreshold || charCount > charThreshold;
    const shouldBlock = isFlagged && policy === PASTE_POLICY.BLOCK;

    if (shouldBlock) {
      e.preventDefault();
    }

    const pasteEvent = {
      id: `paste_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      wordCount,
      charCount,
      snippet: pastedText.slice(0, 80),
      flagged: isFlagged,
      blocked: shouldBlock,
      policy,
    };

    setPasteEvents(prev => [...prev, pasteEvent]);
    setLastPasteTime(new Date());
    setTotalPastedChars(prev => prev + (shouldBlock ? 0 : charCount));

    // Log to integrity system
    integrityLogger.logPaste({
      content: pastedText,
      charCount,
      cursorPosition: e.target?.selectionStart || null,
      blocked: shouldBlock,
    });

    // Callbacks
    if (shouldBlock) {
      onPasteBlocked?.(pasteEvent);
    } else if (isFlagged) {
      onPasteDetected?.(pasteEvent);
    }
  }, [enabled, policy, wordThreshold, charThreshold, onPasteDetected, onPasteBlocked]);

  // ── Detect large insertions (potential paste via keyboard) ──
  const checkForLargeInsertion = useCallback((newContentLength) => {
    if (!enabled) return;

    const now = Date.now();
    const timeDelta = now - lastChangeTimeRef.current;
    const charDelta = newContentLength - lastContentLengthRef.current;

    if (charDelta > LARGE_INSERTION_CHARS && timeDelta < LARGE_INSERTION_TIME_MS) {
      const insertionEvent = {
        id: `insertion_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        charCount: charDelta,
        timeDeltaMs: timeDelta,
        suspected: true,
      };

      setPasteEvents(prev => [...prev, insertionEvent]);

      integrityLogger.logLargeInsertion({
        charCount: charDelta,
        cursorPosition: null,
        timeDeltaMs: timeDelta,
      });
    }

    lastContentLengthRef.current = newContentLength;
    lastChangeTimeRef.current = now;
  }, [enabled]);

  // ── Attach global paste listener ──
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('paste', handlePaste, true);
    return () => window.removeEventListener('paste', handlePaste, true);
  }, [enabled, handlePaste]);

  // ── Summary ──
  const summary = {
    totalPasteEvents: pasteEvents.length,
    flaggedEvents: pasteEvents.filter(e => e.flagged).length,
    blockedEvents: pasteEvents.filter(e => e.blocked).length,
    totalPastedCharacters: totalPastedChars,
    suspectedInsertions: pasteEvents.filter(e => e.suspected).length,
  };

  // ── Clear history ──
  const clearHistory = useCallback(() => {
    setPasteEvents([]);
    setTotalPastedChars(0);
    setLastPasteTime(null);
  }, []);

  return {
    pasteEvents,
    lastPasteTime,
    totalPastedChars,
    summary,
    handlePaste,
    checkForLargeInsertion,
    clearHistory,
  };
};

export default usePasteDetection;
