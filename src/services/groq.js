import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Initialize Groq only if API key exists
let groq = null;
if (API_KEY) {
  groq = new Groq({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
}

export const getGroqResponse = async (userMessage, history = []) => {
  try {
    if (!groq) return "Error: Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.";

    // Convert history format for Groq (Llama 3)
    const formattedHistory = history.map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.parts[0].text
    }));

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are MindEcho, a calm, supportive, and empathetic emotional assistant. Respond with warmth, clarity, and deep empathy. IMPORTANT: ALWAYS respond in English only, regardless of the language the user uses. Keep responses concise but meaningful. Never cut off mid-sentence."
        },
        ...formattedHistory,
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || "No response from MindEcho.";
  } catch (error) {
    console.error("Groq Error:", error);
    return `MindEcho (Groq) Error: ${error.message}`;
  }
};

export const detectEmotionGroq = async (text) => {
  try {
    if (!groq) return "Neutral";
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Analyze emotion: [Sad, Anxious, Happy, Angry, Neutral]. Return ONLY the word."
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "llama-3.1-8b-instant",
    });
    return response.choices[0]?.message?.content?.trim() || "Neutral";
  } catch (error) {
    return "Neutral";
  }
};
