import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, MessageCircle } from 'lucide-react';

export default function Sidebar({ sessions, currentSessionId, onSessionSelect, onNewSession }) {
  const { logout, currentUser } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">
            {currentUser?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-email">{currentUser?.email}</div>
        </div>
        <button className="new-chat-btn" onClick={onNewSession}>
          <Plus size={20} />
          <span>New Session</span>
        </button>
      </div>

      <div className="sessions-list">
        <h3>Previous Sessions</h3>
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
            onClick={() => onSessionSelect(session.id)}
          >
            <MessageCircle size={18} />
            <span className="session-title">{session.sessionTitle}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
