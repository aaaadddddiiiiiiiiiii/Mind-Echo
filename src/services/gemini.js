import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
  try {
    if (!API_KEY) return "Error: API Key is missing in .env file.";

    // FORCED to gemini-pro to avoid 404 errors on Free Tier
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: "You are MindEcho, a calm, supportive, and empathetic emotional assistant. Respond with warmth, clarity, and deep empathy. Keep responses concise but meaningful."
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return `MindEcho Error: ${error.message}`;
  }
};

export const detectEmotion = async (text) => {
  try {
    if (!API_KEY) return "Neutral";
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze emotion: [Sad, Anxious, Happy, Angry, Neutral]. Text: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim() || "Neutral";
  } catch (error) {
    return "Neutral";
  }
};
