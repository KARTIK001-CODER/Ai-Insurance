import React from 'react';

const ComparisonTable = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="alert-info">No comparison data available for these criteria.</div>
  );

  return (
    <div className="table-container mb-8">
      <table>
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Insurer</th>
            <th>Premium (Rs/yr)</th>
            <th>Coverage</th>
            <th>Waiting Period</th>
            <th>Key Benefit</th>
            <th>Suitability</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>{row.policyName}</td>
              <td style={{ fontWeight: 500 }}>{row.insurer}</td>
              <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{row.premium}</td>
              <td>{row.coverageAmount}</td>
              <td style={{ fontSize: '0.9rem' }}>{row.waitingPeriod}</td>
              <td style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{row.keyBenefit}</td>
              <td>
                <span style={{ 
                   background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                   color: 'white', 
                   padding: '0.4rem 0.75rem', 
                   borderRadius: '20px',
                   fontWeight: 700,
                   fontSize: '0.8rem',
                   boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                }}>
                  {row.suitabilityScore}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;

