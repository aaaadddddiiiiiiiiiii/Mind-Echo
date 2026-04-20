import React from 'react';

export default function MessageBubble({ type, content, emotion }) {
  return (
    <div className={`message-bubble-wrapper ${type}`}>
      <div className={`message-bubble ${type}`}>
        <p>{content}</p>
        {emotion && type === 'ai' && (
          <div className="message-emotion">
            Detected: <span className={`emotion-tag ${emotion.toLowerCase()}`}>{emotion}</span>
          </div>
        )}
      </div>
    </div>
  );
}
