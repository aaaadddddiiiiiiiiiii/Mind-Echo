import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMessages, saveMessage } from '../services/db';
import { getGeminiResponse, detectEmotion } from '../services/gemini';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';

export default function ChatWindow({ sessionId, isPrivate }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;
    const unsubscribe = getMessages(sessionId, (data) => {
      setMessages(data);
    });
    return unsubscribe;
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || !sessionId || loading) return;

    setLoading(true);
    
    // Add user message optimistically if private or just local
    const tempUserMsg = { id: 'temp-u', message: text, sender: 'user', type: 'user' };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // 1. Detect emotion
      const emotion = await detectEmotion(text);
      
      // 2. Get AI response
      const history = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'model',
        parts: [{ text: m.message || m.response }],
      }));
      
      const aiResponse = await getGeminiResponse(text, history);

      // 3. Save to Firestore if not private
      if (!isPrivate) {
        await saveMessage(currentUser.uid, sessionId, text, aiResponse, emotion, isPrivate);
      } else {
        // If private, just add to local state
        setMessages(prev => [
          ...prev.filter(m => m.id !== 'temp-u'),
          { id: Date.now() + '-u', message: text, type: 'user' },
          { id: Date.now() + '-ai', response: aiResponse, emotion, type: 'ai' }
        ]);
      }
    } catch (error) {
      console.error("Send Message Error:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, isPrivate, currentUser, loading, messages]);

  if (!sessionId) {
    return (
      <div className="chat-empty-state">
        <div className="empty-state-content">
          <img src="/placeholder-logo.png" alt="" style={{ display: 'none' }} />
          <h2>Start sharing what's on your mind...</h2>
          <p>Create a new session or select an existing one to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id || index}>
            {msg.message && <MessageBubble type="user" content={msg.message} />}
            {msg.response && (
              <MessageBubble 
                type="ai" 
                content={msg.response} 
                emotion={msg.emotion} 
              />
            )}
          </React.Fragment>
        ))}
        {loading && <div className="typing-indicator">MindEcho is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <InputBox onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}
