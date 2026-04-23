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
        return { ...prev, preExistingConditions: [...conditions, value] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.age || formData.preExistingConditions.length === 0) {
      alert('Please fill out all fields and select at least one condition (or None).');
      return;
    }
    onSubmit({
      ...formData,
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

      <div className="form-group mb-8">
        <label className="form-label">Pre-existing Conditions</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {conditionsList.map(cond => (
            <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F3F4F6', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
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

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'Generating Recommendation...' : 'Get Recommendation'}
      </button>
    </form>
  );
};

export default ProfileForm;
