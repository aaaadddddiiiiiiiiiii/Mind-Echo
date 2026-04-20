import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
  try {
    if (!API_KEY) return "Error: API Key is missing.";

    // Clean history to ensure it starts with 'user' and roles alternate correctly
    let cleanedHistory = [];
    if (history.length > 0) {
      // Find the first 'user' message
      const firstUserIndex = history.findIndex(m => m.role === 'user');
      if (firstUserIndex !== -1) {
        cleanedHistory = history.slice(firstUserIndex);
      }
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are MindEcho, a supportive emotional companion. Respond with deep empathy and warmth. If the user speaks in Hindi or Hinglish, respond in a mix of Hindi and English to stay relatable. Keep responses naturally conversational and complete your thoughts. Never cut off mid-sentence."
    });

    const chat = model.startChat({
      history: cleanedHistory,
      generationConfig: {
        maxOutputTokens: 2048, // Increased to prevent half-responses
        temperature: 0.7,
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
    const prompt = `Analyze emotion [Sad, Anxious, Happy, Angry, Neutral]. Return ONLY the word. Text: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emotion = response.text().replace(/[*"']/g, '').trim();
    return emotion || "Neutral";
  } catch (error) {
    return "Neutral";
  }
};
