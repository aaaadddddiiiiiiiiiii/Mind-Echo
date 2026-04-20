import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
  try {
    if (!API_KEY) return "Error: API Key is missing.";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are MindEcho, a calm, supportive, and empathetic emotional assistant. Respond with warmth, clarity, and deep empathy. Your goal is to make the user feel heard and understood. Keep responses concise but meaningful. Avoid robotic or clinical language."
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
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `Analyze the emotional tone of this message and return ONLY one word from this list: [Sad, Anxious, Happy, Angry, Neutral]. Do not use any formatting or punctuation.
    Message: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Clean up any formatting like **Anxious** or "Anxious"
    const emotion = response.text().replace(/[*"']/g, '').trim();
    
    const validEmotions = ["Sad", "Anxious", "Happy", "Angry", "Neutral"];
    const found = validEmotions.find(e => emotion.toLowerCase().includes(e.toLowerCase()));
    return found || "Neutral";
  } catch (error) {
    console.error("Emotion Detection Error:", error);
    return "Neutral";
  }
};
