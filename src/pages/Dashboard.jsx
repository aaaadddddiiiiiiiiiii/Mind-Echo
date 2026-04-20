import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import InsightCard from '../components/InsightCard';
import { getSessions, createSession } from '../services/db';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = getSessions(currentUser.uid, (data) => {
      setSessions(data);
      if (data.length > 0 && !currentSessionId) {
        setCurrentSessionId(data[0].id);
      }
    });
    return unsubscribe;
  }, [currentUser]);

  const handleNewSession = async () => {
    const title = prompt("Enter a title for this session:", "New Conversation");
    if (title) {
      const docRef = await createSession(currentUser.uid, title);
      setCurrentSessionId(docRef.id);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        sessions={sessions} 
        currentSessionId={currentSessionId} 
        onSessionSelect={setCurrentSessionId}
        onNewSession={handleNewSession}
      />
      <main className="main-content">
        <div className="dashboard-header">
          <div className="header-info">
            <h1>MindEcho</h1>
            <p>Your emotional companion</p>
          </div>
          <div className="header-actions">
            <div className="private-mode-toggle">
              <span>Private Mode</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isPrivate} 
                  onChange={() => setIsPrivate(!isPrivate)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="chat-layout">
          <ChatWindow 
            sessionId={currentSessionId} 
            isPrivate={isPrivate} 
          />
          <aside className="insights-panel">
            <InsightCard sessionId={currentSessionId} />
          </aside>
        </div>
      </main>
    </div>
  );
}
