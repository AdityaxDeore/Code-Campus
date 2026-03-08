/**
 * Gemini AI Service
 * Uses Google Gemini 2.0 Flash REST API for the AI assistant in code editors.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are an AI coding tutor for CodeCampus, an academic coding education platform for university CS students.

Rules:
- NEVER give full solutions or complete code. Only give hints, explanations, and debugging guidance.
- Keep responses concise (under 300 words).
- When helping debug, point to the likely issue without fixing it entirely.
- When giving hints, guide the student toward the answer with questions.
- When explaining concepts, use simple language with small examples.
- If the student asks for a full solution, politely decline and offer a hint instead.
- Format code snippets with backticks when needed.`;

/**
 * Send a message to Gemini and get a response.
 * @param {string} userMessage - The user's question
 * @param {object} context - Optional context (code, language, assignment title)
 * @param {Array} history - Previous messages [{role, text}]
 * @returns {Promise<string>} The AI response text
 */
export const askGemini = async (userMessage, context = {}, history = []) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    return getFallbackResponse(userMessage);
  }

  // Build conversation history for context
  const contents = [];

  // Add system instruction as first user turn
  let systemContext = SYSTEM_PROMPT;
  if (context.assignmentTitle) {
    systemContext += `\n\nThe student is working on: "${context.assignmentTitle}"`;
  }
  if (context.language) {
    systemContext += `\nProgramming language: ${context.language}`;
  }
  if (context.code) {
    systemContext += `\n\nTheir current code:\n\`\`\`${context.language || ''}\n${context.code.slice(0, 2000)}\n\`\`\``;
  }

  contents.push({ role: 'user', parts: [{ text: systemContext }] });
  contents.push({ role: 'model', parts: [{ text: 'Understood. I will help as a coding tutor without giving full solutions.' }] });

  // Add recent conversation history (last 6 messages to stay within limits)
  const recentHistory = history.slice(-6);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.text }] });
    } else if (msg.role === 'ai') {
      contents.push({ role: 'model', parts: [{ text: msg.text }] });
    }
  }

  // Add the current message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return getFallbackResponse(userMessage);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return getFallbackResponse(userMessage);
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini request failed:', error);
    return getFallbackResponse(userMessage);
  }
};

// ── Fallback responses when API is unavailable ──
const FALLBACK_RESPONSES = {
  hint: [
    "Think about what data structure would give you O(1) lookups. What comes to mind?",
    "Consider the base case first — what happens when the input is empty or has one element?",
    "Try tracing through a small example with 3-4 elements. What pattern do you notice?",
    "This is a classic divide-and-conquer scenario. How can you split the problem in half?",
  ],
  debug: [
    "Check your loop bounds — are you going one past the end? Off-by-one errors are common here.",
    "Look at where you're comparing values. Are you using the right operator?",
    "Trace through your code with a simple input like [1, 2, 3]. Where does it diverge from expected?",
  ],
  explain: [
    "This algorithm works by repeatedly dividing the search space in half. Each step eliminates half of the remaining elements.",
    "The key idea is memoization — storing results of expensive function calls so we don't recompute them.",
  ],
  general: [
    "I can help you think through this. What specific part is confusing?",
    "Let me guide you step by step. What's the first thing your function should check?",
    "Try breaking it down: what are the inputs, what should the output be, and what are edge cases?",
  ],
};

function classifyQuery(text) {
  const lower = text.toLowerCase();
  if (lower.includes('hint') || lower.includes('help') || lower.includes('stuck')) return 'hint';
  if (lower.includes('debug') || lower.includes('error') || lower.includes('wrong') || lower.includes('fix')) return 'debug';
  if (lower.includes('explain') || lower.includes('why') || lower.includes('how does')) return 'explain';
  return 'general';
}

function getFallbackResponse(query) {
  const category = classifyQuery(query);
  const responses = FALLBACK_RESPONSES[category];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default askGemini;
