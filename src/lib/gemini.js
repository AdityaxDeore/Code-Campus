import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

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
    const response = await axios({
      url: GEMINI_URL,
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
      }
    });

    const text = response.data.candidates[0].content.parts[0].text;
    return text ? text.trim() : 'AI returned an empty response. Please try again.';
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error("Gemini API error:", error.response?.data || error);
    return `AI request failed: ${errMsg}`;
  }
}

export default askGemini;
