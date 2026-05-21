import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GEMINI_FALLBACK_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

let lastRequestTime = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableError(error) {
  const status = error?.response?.status;
  const code = error?.code;

  if ([408, 429, 500, 502, 503, 504].includes(status)) return true;
  if (code === 'ECONNABORTED' || code === 'ERR_NETWORK') return true;

  return false;
}

function getFriendlyErrorMessage(error) {
  const status = error?.response?.status;
  const apiMessage = error?.response?.data?.error?.message;

  if (status === 400 || status === 401 || status === 403) {
    return `AI request rejected (${status}). Check VITE_GEMINI_API_KEY and API restrictions.${apiMessage ? ` ${apiMessage}` : ''}`;
  }

  if (status === 429) {
    return 'AI request limit reached (429). Please wait a moment and try again.';
  }

  if (status >= 500) {
    return 'Gemini service is temporarily unavailable. Please try again in a few seconds.';
  }

  if (error?.code === 'ECONNABORTED') {
    return 'AI request timed out. Please try again.';
  }

  if (error?.code === 'ERR_NETWORK') {
    return 'Network error while contacting AI service. Check your internet connection and try again.';
  }

  return `AI request failed: ${apiMessage || error.message}`;
}

async function callGemini(contents) {
  const now = Date.now();
  if (now - lastRequestTime < 2000) {
    await new Promise(r => setTimeout(r, 2000));
  }
  lastRequestTime = Date.now();

  const endpoints = [GEMINI_URL, GEMINI_FALLBACK_URL];
  let lastError;

  for (let endpointIndex = 0; endpointIndex < endpoints.length; endpointIndex += 1) {
    const endpoint = endpoints[endpointIndex];

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await axios({
          url: endpoint,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY
          },
          data: {
            contents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 2048,
            }
          },
          timeout: 25000
        });

        return response.data;
      } catch (error) {
        lastError = error;

        if (!isRetryableError(error) || attempt === 3) {
          break;
        }

        await sleep(800 * attempt);
      }
    }
  }

  throw lastError;
}

const SYSTEM_PROMPT = `You are an AI coding tutor for CodeCampus, an academic coding education platform for university CS students.

Rules:
- NEVER give full solutions or complete code. Only give hints, explanations, and debugging guidance.
- Keep responses concise (under 300 words).
- When helping debug, point to the likely issue without fixing it entirely.
- When giving hints, guide the student toward the answer with questions.
- When explaining concepts, use simple language with small examples.
- If the student asks for a full solution, politely decline and offer a hint instead.
- Format code snippets with backticks when needed.`;

export async function askGemini(userMessage, context = {}, history = []) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    return 'AI assistant is not configured. Please add your Gemini API key to the .env file and restart the dev server.';
  }

  // Build conversation contents
  const contents = [];

  // System instruction as first user/model turn
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

  contents.push({ parts: [{ text: systemContext }], role: 'user' });
  contents.push({ parts: [{ text: 'Understood. I will help as a coding tutor without giving full solutions.' }], role: 'model' });

  // Add recent conversation history (last 6 messages)
  const recentHistory = history.slice(-6);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      contents.push({ parts: [{ text: msg.text }], role: 'user' });
    } else if (msg.role === 'ai') {
      contents.push({ parts: [{ text: msg.text }], role: 'model' });
    }
  }

  // Add the current message
  contents.push({ parts: [{ text: userMessage }], role: 'user' });

  try {
    const data = await callGemini(contents);
    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const text = parts
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();

    return text || 'AI returned an empty response. Please try again.';
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFriendlyErrorMessage(error);
  }
}

export default askGemini;
