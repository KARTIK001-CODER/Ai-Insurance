import React from 'react';

const ComparisonTable = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="alert-info">No comparison data available for these criteria.</div>
  );

  const getBadgeClass = (score) => {
    if (!score) return '';
    const s = score.toLowerCase();
    if (s.includes('high') || s.includes('good') || s.includes('recommend')) return 'badge-high';
    if (s.includes('caution') || s.includes('average') || s.includes('moderate')) return 'badge-caution';
    return 'badge-high'; // Default to high/green if unsure
  };

  return (
    <div className="comparison-card">
      <div className="comparison-header">
        <h2 className="comparison-title">Peer Comparison Table</h2>
      </div>
      
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Insurer</th>
              <th className="numeric-cell">Premium (Rs/yr)</th>
              <th>Coverage</th>
              <th>Waiting Period</th>
              <th>Key Benefit</th>
              <th>Suitability</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="policy-name-cell">{row.policyName}</td>
                <td>{row.insurer}</td>
                <td className="numeric-cell">₹{row.premium}</td>
                <td className="text-wrap-column">{row.coverageAmount}</td>
                <td>{row.waitingPeriod}</td>
                <td className="text-wrap-column" style={{ fontSize: '0.85rem' }}>{row.keyBenefit}</td>
                <td>
                  <span className={`suitability-badge ${getBadgeClass(row.suitabilityScore)}`}>
                    {row.suitabilityScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;

