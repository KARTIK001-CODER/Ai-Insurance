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
    if (!window.confirm('Are you sure?')) return;
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
    <div>
      <div className="card mb-8">
        <h3 className="mb-4">Upload New Policy</h3>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {msg && <div style={{ color: 'green', marginBottom: '1rem' }}>{msg}</div>}
        <form onSubmit={handleUpload} className="grid-2">
          <div className="form-group">
            <label className="form-label">Policy Document (PDF/TXT/JSON)</label>
            <input type="file" className="form-input" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label className="form-label">Policy Name</label>
            <input type="text" className="form-input" value={policyName} onChange={e => setPolicyName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Insurer</label>
            <input type="text" className="form-input" value={insurer} onChange={e => setInsurer(e.target.value)} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="mb-4">Manage Policies</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Insurer</th>
                <th>File Type</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.policyName}</td>
                  <td>{p.insurer}</td>
                  <td>{p.fileType}</td>
                  <td>{new Date(p.uploadDate).toLocaleDateString()}</td>
                  <td>
                    <button className="btn" style={{ marginRight: '0.5rem', background: '#E5E7EB', padding: '0.5rem 1rem' }} onClick={() => handleUpdate(p.id, p.policyName, p.insurer)}>Edit</button>
                    <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {policies.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No policies found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
