import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      minHeight: '60vh',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
        AI-Powered Insurance Recommendation Platform
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--text-muted)', 
        maxWidth: '600px', 
        marginBottom: '2.5rem',
        lineHeight: '1.6'
      }}>
        Get personalized health insurance advice powered by artificial intelligence. 
        We analyze complex policy documents to find the perfect match for your lifestyle and needs.
      </p>
      
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/user')}
          style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}
        >
          Get Recommendation
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/admin')}
          style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}
        >
          Admin Portal
        </button>
      </div>

      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '900px' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>AI Analysis</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Deep analysis of policy documents using RAG technology.</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Personalized</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recommendations tailored to your age, city, and lifestyle.</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Instant Chat</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ask questions about any policy and get instant AI-powered answers.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
