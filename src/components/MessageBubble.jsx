import React from 'react';

export default function MessageBubble({ type, content, emotion }) {
  // Clean up emotion string just in case
  const cleanEmotion = emotion?.replace(/[*"']/g, '').trim();

  return (
    <div className={`message-bubble-wrapper ${type}`}>
      <div className={`message-bubble ${type} ${cleanEmotion?.toLowerCase()}`}>
        <p>{content}</p>
        {cleanEmotion && type === 'ai' && (
          <div className="message-meta">
            <span className="emotion-indicator">
              Mood Detected: <strong>{cleanEmotion}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
