import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import ComparisonTable from '../components/ComparisonTable';
import CoverageDetails from '../components/CoverageDetails';
import ChatBox from '../components/ChatBox';

const Recommendation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;
  if (!state || !state.recommendation) {
    return <Navigate to="/" replace />;
  }

  const { profile, recommendation } = state;

  return (
    <div className="recommendation-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Your Personalized Recommendation</h2>
        <button className="btn" onClick={() => navigate('/')} style={{ background: '#E5E7EB' }}>Back to Form</button>
      </div>

      <div className="card mb-8">
        <h3 className="mb-4">1. Peer Comparison Table</h3>
        <ComparisonTable data={recommendation.peerComparisonTable} />
      </div>

      <div className="grid-2">
        <div>
          <CoverageDetails details={recommendation.coverageDetailTable} />
          <div className="card">
            <h3 className="mb-4">Why This Policy?</h3>
            <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>
              {recommendation.whyThisPolicy}
            </p>
          </div>
        </div>

        <div>
          <ChatBox 
            userProfile={profile} 
            selectedPolicy={recommendation.peerComparisonTable?.[0]?.policyName || ''} 
          />
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
