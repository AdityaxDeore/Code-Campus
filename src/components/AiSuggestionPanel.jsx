/**
 * ════════════════════════════════════════════════════════════════
 *  AI Suggestion Panel
 * ════════════════════════════════════════════════════════════════
 *
 *  Controlled AI assistance with:
 *    - Per-student usage tracking & rate limiting
 *    - No full solutions (hint-only mode)
 *    - Assignment AI policy enforcement
 *    - Suggestion length limits
 *    - Logged to integrity system
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from './AppIcon';
import { integrityLogger } from '../lib/integrity';
import { askGemini } from '../lib/gemini';

// ── AI Policy Levels ──
export const AI_POLICY = {
  DISABLED: 'disabled',       // No AI assistance at all
  HINTS_ONLY: 'hints_only',   // Only conceptual hints, no code
  LIMITED: 'limited',         // Limited code suggestions, max 5 per session
  STANDARD: 'standard',       // Standard assistance, logged
};

const AiSuggestionPanel = ({
  aiPolicy = AI_POLICY.STANDARD,
  maxSuggestionsPerSession = 20,
  onClose,
  currentCode = '',
  language = 'python',
  assignmentTitle = '',
  className = '',
}) => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: aiPolicy === AI_POLICY.DISABLED
        ? '⚠ AI assistance is disabled for this assignment.'
        : aiPolicy === AI_POLICY.HINTS_ONLY
          ? `I can provide conceptual hints for "${assignmentTitle}" — no code solutions. What do you need help with?`
          : `Hi! I'm your AI assistant for "${assignmentTitle}". I can help with hints, debugging, and explaining concepts. What do you need?`,
      type: 'system',
    },
  ]);
  const [input, setInput] = useState('');
  const [suggestionsUsed, setSuggestionsUsed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const messagesEndRef = useRef(null);
  const lastRequestTimeRef = useRef(0);

  const isDisabled = aiPolicy === AI_POLICY.DISABLED;
  const isAtLimit = suggestionsUsed >= maxSuggestionsPerSession;
  const remainingSuggestions = maxSuggestionsPerSession - suggestionsUsed;

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Get AI response via Gemini ──
  const getResponse = useCallback(async (query) => {
    const response = await askGemini(query, {
      assignmentTitle,
      language,
      code: currentCode,
    }, messages.filter(m => m.type !== 'system'));

    return response;
  }, [assignmentTitle, language, currentCode, messages]);

  // ── Send message ──
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isDisabled || isAtLimit) return;

    // Rate limiting: 1 request per 3 seconds
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 3000) {
      setRateLimited(true);
      setTimeout(() => setRateLimited(false), 3000);
      return;
    }
    lastRequestTimeRef.current = now;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    // Log AI request
    integrityLogger.logAiSuggestion({
      action: 'requested',
      suggestionLength: 0,
      context: userMessage.slice(0, 100),
    });

    setIsTyping(true);

    try {
      const response = await getResponse(userMessage);

      setMessages(prev => [...prev, { role: 'ai', text: response, type: 'suggestion' }]);
      setSuggestionsUsed(prev => prev + 1);

      // Log AI response
      integrityLogger.logAiSuggestion({
        action: 'used',
        suggestionLength: response.length,
        context: userMessage.slice(0, 100),
      });
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again.', type: 'suggestion' }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isDisabled, isAtLimit, getResponse]);

  // ── Quick action buttons ──
  const quickActions = [
    { label: 'Hint', query: 'Can you give me a hint?' },
    { label: 'Debug', query: 'Can you help me debug this?' },
    { label: 'Explain', query: 'Can you explain this concept?' },
  ];

  // ── Dismiss suggestion ──
  const dismissSuggestion = useCallback((index) => {
    integrityLogger.logAiSuggestion({
      action: 'dismissed',
      suggestionLength: messages[index]?.text?.length || 0,
      context: 'user_dismissed',
    });
  }, [messages]);

  return (
    <div className={`flex flex-col bg-[#252526] ${className}`}>
      {/* Header */}
      <div className="h-[35px] flex items-center justify-between px-3 border-b border-[#1e1e1e] flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Icon name="Sparkles" size={13} className="text-indigo-400" />
          <span className="text-[11px] font-semibold text-[#bbb] uppercase tracking-wider">
            AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isDisabled && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${
              isAtLimit ? 'bg-red-900/40 text-red-400' : 'bg-[#3c3c3c] text-[#888]'
            }`}>
              {remainingSuggestions} left
            </span>
          )}
          {onClose && (
            <button onClick={onClose} className="text-[#888] hover:text-white p-1">
              <Icon name="X" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Policy banner */}
      {aiPolicy !== AI_POLICY.STANDARD && (
        <div className={`px-3 py-1.5 border-b border-[#1e1e1e] ${
          aiPolicy === AI_POLICY.DISABLED
            ? 'bg-red-900/20'
            : aiPolicy === AI_POLICY.HINTS_ONLY
              ? 'bg-amber-900/20'
              : 'bg-blue-900/20'
        }`}>
          <p className={`text-[10px] flex items-center gap-1 ${
            aiPolicy === AI_POLICY.DISABLED
              ? 'text-red-400'
              : aiPolicy === AI_POLICY.HINTS_ONLY
                ? 'text-amber-400'
                : 'text-blue-300'
          }`}>
            <Icon name={aiPolicy === AI_POLICY.DISABLED ? 'Ban' : 'Info'} size={10} />
            {aiPolicy === AI_POLICY.DISABLED && 'AI assistance is disabled for this assignment'}
            {aiPolicy === AI_POLICY.HINTS_ONLY && 'Hints only — no code solutions provided'}
            {aiPolicy === AI_POLICY.LIMITED && `Limited mode — ${remainingSuggestions} suggestions remaining`}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-2 pt-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-3 py-2 rounded-lg text-[12px] leading-relaxed relative group ${
              m.role === 'user'
                ? 'bg-[#264f78] text-[#e0e0e0]'
                : m.type === 'system'
                  ? 'bg-[#2d2d2d] text-[#999]'
                  : 'bg-[#333] text-[#ccc]'
            }`}>
              {m.role === 'ai' && m.type !== 'system' && (
                <Icon name="Sparkles" size={11} className="text-indigo-400 inline mr-1 -mt-0.5" />
              )}
              {m.text}
              {m.role === 'ai' && m.type === 'suggestion' && (
                <button
                  onClick={() => dismissSuggestion(i)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#555] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Dismiss"
                >
                  <Icon name="X" size={8} className="text-[#ccc]" />
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#333] px-3 py-2 rounded-lg text-[12px] text-[#888]">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {!isDisabled && (
        <div className="p-3 border-t border-[#1e1e1e]">
          {/* Quick actions */}
          <div className="flex gap-1.5 mb-2">
            {quickActions.map(q => (
              <button
                key={q.label}
                onClick={() => setInput(q.query)}
                disabled={isAtLimit}
                className="px-2 py-1 bg-[#333] text-[10px] text-[#ccc] rounded border border-[#555] hover:border-[#888] transition-colors disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-1">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={
                isAtLimit
                  ? 'Suggestion limit reached'
                  : rateLimited
                    ? 'Please wait…'
                    : 'Ask about your code…'
              }
              disabled={isAtLimit || rateLimited}
              className="flex-1 bg-[#3c3c3c] border border-[#555] text-[12px] text-[#ccc] rounded px-2 py-[5px] focus:outline-none focus:border-[#007acc] placeholder:text-[#666] disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isAtLimit || rateLimited || !input.trim()}
              className="px-2 py-1 bg-[#007acc] text-white rounded hover:bg-[#1b8ad3] transition-colors disabled:opacity-50"
            >
              <Icon name="SendHorizontal" size={13} />
            </button>
          </div>

          {/* Usage counter */}
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-[9px] text-[#555]">
              {suggestionsUsed}/{maxSuggestionsPerSession} suggestions used
            </p>
            <div className="w-16 h-1 bg-[#333] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  suggestionsUsed / maxSuggestionsPerSession > 0.8
                    ? 'bg-red-500'
                    : suggestionsUsed / maxSuggestionsPerSession > 0.5
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                }`}
                style={{ width: `${(suggestionsUsed / maxSuggestionsPerSession) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSuggestionPanel;
