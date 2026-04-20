import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function InputBox({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  const suggestions = [
    "I feel anxious today",
    "I'm feeling overwhelmed",
    "I'm happy about something!",
    "I'm feeling a bit sad"
  ];

  return (
    <div className="input-box-container">
      <div className="suggestions">
        {suggestions.map((s, i) => (
          <button 
            key={i} 
            className="suggestion-chip"
            onClick={() => setText(s)}
            disabled={disabled}
          >
            {s}
          </button>
        ))}
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what's on your mind..."
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || !text.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
