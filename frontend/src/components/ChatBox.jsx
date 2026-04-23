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
      // API expects userQuestion, userProfile, selectedPolicy, chatHistory
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
      <div style={{ padding: '1rem', background: '#F3F4F6', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
        AI Policy Explainer
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role === 'user' ? 'chat-user' : 'chat-agent'}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="chat-message chat-agent">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          className="form-input" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about co-pay, exclusions, etc..." 
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
