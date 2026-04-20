import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
  try {
    if (!API_KEY) return "Error: API Key is missing in .env file.";

    // Try gemini-1.5-flash first, then fallback to gemini-pro
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (e) {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const systemPrompt = `You are MindEcho, a calm, supportive, and empathetic emotional assistant. 
    Respond with warmth, clarity, and deep empathy. 
    Keep responses concise but meaningful.`;

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(`System: ${systemPrompt}\n\nUser: ${userMessage}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    // Returning the actual error so the user can see it in the chat bubble
    return `MindEcho Error: ${error.message}. (Please ensure your API key is valid for the Free Tier).`;
  }
};

export const detectEmotion = async (text) => {
  try {
    if (!API_KEY) return "Neutral";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the emotional tone: [Sad, Anxious, Happy, Angry, Neutral]. Text: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emotion = response.text().trim();
    return ["Sad", "Anxious", "Happy", "Angry", "Neutral"].includes(emotion) ? emotion : "Neutral";
  } catch (error) {
    return "Neutral";
  }
};
