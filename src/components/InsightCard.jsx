import React, { useMemo, useState, useEffect } from 'react';
import { getMessages } from '../services/db';

export default function InsightCard({ sessionId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!sessionId) return;
    const unsubscribe = getMessages(sessionId, (data) => {
      setMessages(data);
    });
    return unsubscribe;
  }, [sessionId]);

  const insights = useMemo(() => {
    if (messages.length === 0) return null;

    const recentEmotions = messages
      .slice(-10)
      .map(m => m.emotion)
      .filter(Boolean);

    if (recentEmotions.length === 0) return null;

    const counts = recentEmotions.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const dominant = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    let summary = "";
    switch (dominant) {
      case 'Sad': summary = "You've been feeling a bit low lately. Remember to be kind to yourself."; break;
      case 'Anxious': summary = "You seem a bit overwhelmed. Take a deep breath, you're doing your best."; break;
      case 'Happy': summary = "You're in a great mood! It's wonderful to see this positive energy."; break;
      case 'Angry': summary = "Things seem frustrating right now. It's okay to feel this way."; break;
      default: summary = "You seem to be in a stable headspace today.";
    }

    const emotionPercentages = Object.entries(counts).map(([emotion, count]) => ({
      emotion,
      percentage: Math.round((count / recentEmotions.length) * 100)
    }));

    return { summary, dominant, emotionPercentages };
  }, [messages]);

  if (!insights) return null;

  return (
    <div className="insight-card">
      <div className="insight-header">
        <h3>Mood Insights</h3>
        <span className={`mood-dot ${insights.dominant.toLowerCase()}`}></span>
      </div>
      <p className="insight-summary">{insights.summary}</p>
      
      <div className="emotion-trends">
        <h4>Emotional Trend</h4>
        {insights.emotionPercentages.map(({ emotion, percentage }) => (
          <div key={emotion} className="trend-item">
            <div className="trend-label">
              <span>{emotion}</span>
              <span>{percentage}%</span>
            </div>
            <div className="trend-bar-bg">
              <div 
                className={`trend-bar-fill ${emotion.toLowerCase()}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
