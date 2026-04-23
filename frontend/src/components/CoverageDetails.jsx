import React from 'react';

const CoverageDetails = ({ details }) => {
  if (!details) return <p>No coverage details available.</p>;

  return (
    <div className="card mb-8" style={{ background: '#F9FAFB' }}>
      <h3 className="mb-4" style={{ color: 'var(--text-main)' }}>Coverage Details (Top Recommended)</h3>
      <div className="grid-2">
        <div>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Inclusions</h4>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
            {details.inclusions?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>

          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Exclusions</h4>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
            {details.exclusions?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div>
          <div className="mb-4">
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Sub-limits</h4>
            <p>{details.subLimits || 'Not specified'}</p>
          </div>
          <div className="mb-4">
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Co-pay %</h4>
            <p>{details.coPay || 'Not specified'}</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Claim Type</h4>
            <p>{details.claimType || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageDetails;
