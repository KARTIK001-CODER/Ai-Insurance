import React, { useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import ComparisonTable from '../components/ComparisonTable';
import CoverageDetails from '../components/CoverageDetails';
import ChatBox from '../components/ChatBox';

const Recommendation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  useEffect(() => {
    if (state?.recommendation) {
      console.log("[RecommendationPage] API Response Data:", state.recommendation);
    }
  }, [state]);

  if (!state || !state.recommendation) {
    return <Navigate to="/" replace />;
  }

  const { profile, recommendation } = state;

  // Use the keys returned by the updated backend
  const comparisonData = recommendation.comparisonTable || [];
  const coverageData = recommendation.coverageDetails || null;
  const explanationText = recommendation.explanation || "No explanation available.";

  return (
    <div className="recommendation-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Your Personalized Recommendation</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" onClick={() => navigate('/admin')} style={{ background: '#F3F4F6', color: 'var(--text-main)', border: '1px solid #D1D5DB' }}>Admin</button>
          <button className="btn" onClick={() => navigate('/')} style={{ background: '#E5E7EB' }}>Back to Form</button>
        </div>
      </div>


      <div className="card mb-8">
        <h3 className="mb-4">1. Peer Comparison Table</h3>
        {comparisonData.length > 0 ? (
          <ComparisonTable data={comparisonData} />
        ) : (
          <div className="alert-info" style={{ padding: '1rem', background: '#F3F4F6', borderRadius: '8px' }}>
            No specific policies found for comparison. Please try adjusting your criteria.
          </div>
        )}
      </div>

      <div className="grid-2">
        <div>
          {coverageData ? (
            <CoverageDetails details={coverageData} />
          ) : (
            <div className="card mb-8">
              <h3 className="mb-4">Coverage Details</h3>
              <p>Coverage details are not available for this recommendation.</p>
            </div>
          )}
          
          <div className="card">
            <h3 className="mb-4">Why This Policy?</h3>
            <p style={{ lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {explanationText}
            </p>
          </div>
        </div>

        <div>
          <ChatBox 
            userProfile={profile} 
            selectedPolicy={comparisonData?.[0]?.policyName || 'General Health Insurance'} 
          />
        </div>
      </div>
    </div>
  );
};

export default Recommendation;

