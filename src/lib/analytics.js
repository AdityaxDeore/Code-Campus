import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

/**
 * Safely log a Firebase Analytics event.
 * Wraps all calls in try/catch so ad blockers, network issues,
 * or CSP restrictions never crash the application.
 */
const safeLogEvent = (eventName, params = {}) => {
  try {
    if (!analytics) return;

    // Sanitise parameters — remove undefined/null values and
    // ensure strings don't exceed Firebase's 100-char param value limit.
    const sanitised = Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 100) : v])
    );

    logEvent(analytics, eventName, sanitised);
  } catch (err) {
    // Silently swallow in production; log in development for debugging.
    if (import.meta.env.DEV) {
      console.warn(`[Analytics] Failed to log "${eventName}":`, err);
    }
  }
};

// ── Page views ──────────────────────────────────────────────
export const trackPageView = (pageName, pageTitle = null) => {
  safeLogEvent('page_view', {
    page_title: pageTitle || pageName,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
};

// ── Generic events ──────────────────────────────────────────
export const trackEvent = (eventName, parameters = {}) => {
  if (!eventName || typeof eventName !== 'string') return;
  safeLogEvent(eventName, parameters);
};

// ── Problem solving ─────────────────────────────────────────
export const trackProblemSolved = (problemId, difficulty, timeTaken, language) => {
  safeLogEvent('problem_solved', {
    problem_id: problemId,
    difficulty,
    time_taken: typeof timeTaken === 'number' ? timeTaken : undefined,
    programming_language: language,
  });
};

// ── Code submission ─────────────────────────────────────────
export const trackCodeSubmission = (problemId, result, language) => {
  const validResults = ['success', 'failed', 'timeout'];
  safeLogEvent('code_submission', {
    problem_id: problemId,
    result: validResults.includes(result) ? result : 'unknown',
    programming_language: language,
  });
};

// ── Forum interactions ──────────────────────────────────────
export const trackForumInteraction = (action, postId = null) => {
  const validActions = ['post_created', 'comment_added', 'like', 'share'];
  safeLogEvent('forum_interaction', {
    action: validActions.includes(action) ? action : 'other',
    post_id: postId,
  });
};

// ── Authentication ──────────────────────────────────────────
export const trackLogin = (method) => {
  const validMethods = ['email', 'google', 'github'];
  safeLogEvent('login', {
    method: validMethods.includes(method) ? method : 'unknown',
  });
};

export const trackSignUp = (method) => {
  const validMethods = ['email', 'google', 'github'];
  safeLogEvent('sign_up', {
    method: validMethods.includes(method) ? method : 'unknown',
  });
};
