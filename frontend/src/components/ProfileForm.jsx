import React, { useState } from 'react';

const conditionsList = ['Diabetes', 'Hypertension', 'Asthma', 'Cardiac', 'None', 'Other'];

const ProfileForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    lifestyle: 'Moderate',
    preExistingConditions: [],
    incomeBand: '3-8L',
    cityTier: 'Tier-2'
  });
  const [otherCondition, setOtherCondition] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      const conditions = [...prev.preExistingConditions];
      if (conditions.includes(value)) {
        return { ...prev, preExistingConditions: conditions.filter(c => c !== value) };
      } else {
        // If selecting anything other than 'None', remove 'None'
        if (value !== 'None') {
          const filtered = conditions.filter(c => c !== 'None');
          return { ...prev, preExistingConditions: [...filtered, value] };
        }
        // If selecting 'None', clear everything else
        return { ...prev, preExistingConditions: ['None'] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let conditions = [...formData.preExistingConditions];
    
    if (conditions.includes('Other')) {
      if (!otherCondition.trim()) {
        alert('Please specify the "Other" condition.');
        return;
      }
      // Replace 'Other' with the actual value
      conditions = conditions.map(c => c === 'Other' ? otherCondition.trim() : c);
    }

    if (!formData.fullName || !formData.age || conditions.length === 0) {
      alert('Please fill out all fields and select at least one condition (or None).');
      return;
    }

    onSubmit({
      ...formData,
      preExistingConditions: conditions,
      age: parseInt(formData.age, 10)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input className="form-input" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Age</label>
          <input className="form-input" type="number" name="age" min="1" max="99" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Lifestyle</label>
          <select className="form-select" name="lifestyle" value={formData.lifestyle} onChange={handleChange}>
            <option value="Sedentary">Sedentary</option>
            <option value="Moderate">Moderate</option>
            <option value="Active">Active</option>
            <option value="Athlete">Athlete</option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Income Band</label>
          <select className="form-select" name="incomeBand" value={formData.incomeBand} onChange={handleChange}>
            <option value="under 3L">Under 3L</option>
            <option value="3-8L">3-8L</option>
            <option value="8-15L">8-15L</option>
            <option value="15L+">15L+</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">City Tier</label>
          <select className="form-select" name="cityTier" value={formData.cityTier} onChange={handleChange}>
            <option value="Metro">Metro</option>
            <option value="Tier-2">Tier-2</option>
            <option value="Tier-3">Tier-3</option>
          </select>
        </div>
      </div>

      <div className="form-group mb-4">
        <label className="form-label">Pre-existing Conditions</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {conditionsList.map(cond => (
            <label key={cond} className="condition-badge" style={{ 
              background: formData.preExistingConditions.includes(cond) ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)', 
              color: formData.preExistingConditions.includes(cond) ? 'var(--primary-dark)' : 'var(--text-main)',
              border: formData.preExistingConditions.includes(cond) ? '2px solid var(--primary)' : '2px solid transparent'
            }}>
              <input 
                type="checkbox" 
                value={cond} 
                checked={formData.preExistingConditions.includes(cond)}
                onChange={handleConditionChange}
              />
              {cond}
            </label>
          ))}
        </div>
      </div>

      {formData.preExistingConditions.includes('Other') && (
        <div className="form-group mb-8" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <label className="form-label">Please specify other condition</label>
          <input 
            className="form-input" 
            value={otherCondition} 
            onChange={(e) => setOtherCondition(e.target.value)} 
            placeholder="e.g. Thyroid, PCOD" 
            required 
          />
        </div>
      )}

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
        {loading && <div className="loading-spinner"></div>}
        {loading ? 'Processing...' : 'Get Personalized Recommendation'}
      </button>
    </form>
  );
};


export default ProfileForm;

