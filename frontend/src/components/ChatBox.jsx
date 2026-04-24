import React, { useState, useRef, useEffect } from 'react';
import { sendChat } from '../api';

const ChatBox = ({ userProfile, selectedPolicy }) => {
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Hi! I am your AI insurance advisor. Do you have any questions about the recommendation or need terms explained?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChat(userMsg, userProfile, selectedPolicy, messages);
      setMessages([...newMessages, { role: 'agent', content: res.data.text }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'agent', content: 'Sorry, I encountered an error while fetching the response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div style={{ 
        padding: '1.25rem 1.5rem', 
        background: 'rgba(99, 102, 241, 0.05)', 
        borderBottom: '1px solid var(--border-color)', 
        fontWeight: 700,
        color: 'var(--primary-dark)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
        AI Policy Explainer
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role === 'user' ? 'chat-user' : 'chat-agent'}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-message chat-agent" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.75rem 1rem' }}>
            <span style={{ animation: 'bounce 1s infinite' }}>●</span>
            <span style={{ animation: 'bounce 1s infinite 0.2s' }}>●</span>
            <span style={{ animation: 'bounce 1s infinite 0.4s' }}>●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          className="form-input" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about co-pay, exclusions, etc..." 
          disabled={loading}
          style={{ borderRadius: '25px' }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', padding: '0 1.5rem', height: '45px' }} disabled={loading || !input.trim()}>
          {loading ? '...' : 'Send'}
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatBox;

