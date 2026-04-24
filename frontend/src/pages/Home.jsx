import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import { getRecommendation } from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRecommendation(profileData);
      
      // Pass data to recommendation page via state
      navigate('/recommendation', { 
        state: { 
          profile: profileData,
          recommendation: res.data
        } 
      });
    } catch (err) {
      setError('Failed to fetch recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="mb-4">Get Your AI Health Insurance Recommendation</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <ProfileForm onSubmit={handleSubmit} loading={loading} />
        
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Are you an administrator?</p>
          <button 
            className="btn" 
            onClick={() => navigate('/admin')} 
            style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

