import React from 'react';

const ComparisonTable = ({ data }) => {
  if (!data || data.length === 0) return <p>No comparison data available.</p>;

  return (
    <div className="table-container mb-8">
      <table>
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Insurer</th>
            <th>Premium (Rs/year)</th>
            <th>Coverage Amount</th>
            <th>Waiting Period</th>
            <th>Key Benefit</th>
            <th>Suitability Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{row.policyName}</td>
              <td>{row.insurer}</td>
              <td>{row.premium}</td>
              <td>{row.coverageAmount}</td>
              <td>{row.waitingPeriod}</td>
              <td>{row.keyBenefit}</td>
              <td>
                <span style={{ 
                  background: '#D1FAE5', 
                  color: '#065F46', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '12px',
                  fontWeight: 600
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
