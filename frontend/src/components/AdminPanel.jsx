import React, { useState, useEffect } from 'react';
import { getPolicies, uploadPolicy, updatePolicy, deletePolicy } from '../api';

const AdminPanel = () => {
  const [policies, setPolicies] = useState([]);
  const [authStr, setAuthStr] = useState(btoa('admin:password123')); // fallback
  
  const [file, setFile] = useState(null);
  const [policyName, setPolicyName] = useState('');
  const [insurer, setInsurer] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const fetchPolicies = async () => {
    try {
      const res = await getPolicies(authStr);
      setPolicies(res.data || []);
    } catch (err) {
      setError('Failed to load policies. Check backend/auth.');
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [authStr]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !policyName || !insurer) return setError('All fields required');
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      await uploadPolicy(file, policyName, insurer, authStr);
      setMsg('Policy uploaded successfully!');
      setFile(null); setPolicyName(''); setInsurer('');
      fetchPolicies();
    } catch (err) {
      setError('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy and its indexed chunks?')) return;
    try {
      await deletePolicy(id, authStr);
      fetchPolicies();
    } catch (err) {
      setError('Failed to delete policy.');
    }
  };

  const handleUpdate = async (id, currentName, currentInsurer) => {
    const newName = prompt('Enter new Policy Name:', currentName);
    if (newName === null) return;
    const newInsurer = prompt('Enter new Insurer:', currentInsurer);
    if (newInsurer === null) return;

    try {
      await updatePolicy(id, newName, newInsurer, authStr);
      fetchPolicies();
    } catch (err) {
      setError('Update failed.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-panel-card mb-8">
        <h3 className="mb-6" style={{ color: 'var(--primary-dark)', fontSize: '1.5rem' }}>Index New Policy</h3>
        {error && <div className="alert-info" style={{ background: '#FEE2E2', color: '#B91C1C', borderLeftColor: '#EF4444' }}>{error}</div>}
        {msg && <div className="alert-info">{msg}</div>}
        
        <form onSubmit={handleUpload}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Policy Document (PDF, TXT, JSON)</label>
              <input type="file" className="form-input" accept=".txt,.pdf,.json" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label className="form-label">Policy Name</label>
              <input type="text" className="form-input" placeholder="e.g. Health Plus Gold" value={policyName} onChange={e => setPolicyName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Insurer Name</label>
              <input type="text" className="form-input" placeholder="e.g. HDFC Ergo" value={insurer} onChange={e => setInsurer(e.target.value)} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading && <div className="loading-spinner"></div>}
                {loading ? 'Indexing...' : 'Upload & Index'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="mb-6" style={{ fontSize: '1.25rem' }}>Active Knowledge Base</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Insurer</th>
                <th>Format</th>
                <th>Indexed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{p.policyName}</td>
                  <td style={{ fontWeight: 500 }}>{p.insurer}</td>
                  <td><span style={{ background: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{p.fileType}</span></td>
                  <td>{new Date(p.uploadDate).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleUpdate(p.id, p.policyName, p.insurer)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#FEE2E2', color: '#B91C1C' }} onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {policies.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No policies currently indexed in the vector store.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

