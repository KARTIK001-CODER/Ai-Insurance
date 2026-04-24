import React from 'react';

const CoverageDetails = ({ details }) => {
  if (!details) return <div className="alert-info">No coverage details available for this selection.</div>;

  return (
    <div className="card mb-8" style={{ background: 'rgba(255, 255, 255, 0.4)', border: '1px solid var(--primary-light)' }}>
      <h3 className="mb-6" style={{ color: 'var(--primary-dark)', fontSize: '1.25rem', borderBottom: '1px solid var(--primary-light)', paddingBottom: '0.75rem' }}>
        Coverage Details (Top Recommended)
      </h3>
      <div className="grid-2">
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent)' }}>✓</span> Inclusions
          </h4>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            {details.inclusions?.map((item, idx) => <li key={idx} style={{ marginBottom: '0.4rem' }}>{item}</li>)}
          </ul>

          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#EF4444' }}>✕</span> Exclusions
          </h4>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {details.exclusions?.map((item, idx) => <li key={idx} style={{ marginBottom: '0.4rem' }}>{item}</li>)}
          </ul>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div className="mb-4">
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sub-limits</h4>
            <p style={{ fontWeight: 600 }}>{details.subLimits || 'Not specified'}</p>
          </div>
          <div className="mb-4">
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Co-pay %</h4>
            <p style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{details.coPay || 'Not specified'}</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Claim Type</h4>
            <p style={{ fontWeight: 600 }}>{details.claimType || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageDetails;

