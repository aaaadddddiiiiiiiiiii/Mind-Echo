import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const systemPrompt = `You are MindEcho, a calm, supportive, and empathetic emotional assistant. 
    Respond with warmth, clarity, and deep empathy. 
    Your goal is to make the user feel heard and understood. 
    Keep responses concise but meaningful. 
    Avoid robotic or clinical language. 
    If a user is in crisis, gently encourage them to seek professional help while remaining supportive.`;

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${userMessage}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm here for you, but I'm having a little trouble connecting right now. Please try again in a moment.";
  }
};

export const detectEmotion = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the emotional tone of this message and return ONLY one word from this list: [Sad, Anxious, Happy, Angry, Neutral].
    Message: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emotion = response.text().trim();
    
    const validEmotions = ["Sad", "Anxious", "Happy", "Angry", "Neutral"];
    return validEmotions.includes(emotion) ? emotion : "Neutral";
  } catch (error) {
    console.error("Emotion Detection Error:", error);
    return "Neutral";
  }
};
