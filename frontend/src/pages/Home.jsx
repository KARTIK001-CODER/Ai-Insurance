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
      </div>
    </div>
  );
};

export default Home;
