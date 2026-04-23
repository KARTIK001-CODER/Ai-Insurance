const BASE_URL = 'http://localhost:5000/api';

const getHeaders = (isAdmin = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (isAdmin) {
    // For assignment purposes, we're using a generic admin string or prompting
    // Update these to match the backend .env
    const auth = btoa('admin:password123');
    headers['Authorization'] = `Basic ${auth}`;
  }
  return headers;
};

export const getRecommendation = async (profileData) => {
  const res = await fetch(`${BASE_URL}/recommend`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Failed to fetch recommendation');
  return res.json();
};

export const sendChat = async (userQuestion, userProfile, selectedPolicy, chatHistory) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ userQuestion, userProfile, selectedPolicy, chatHistory }),
  });
  if (!res.ok) throw new Error('Failed to send chat');
  return res.json();
};

export const uploadPolicy = async (file, policyName, insurer, authStr) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('policyName', policyName);
  formData.append('insurer', insurer);

  const res = await fetch(`${BASE_URL}/admin/upload-policy`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authStr}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload policy');
  return res.json();
};

export const getPolicies = async (authStr) => {
  const res = await fetch(`${BASE_URL}/admin/policies`, {
    headers: {
      'Authorization': `Basic ${authStr}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch policies');
  return res.json();
};

export const updatePolicy = async (id, policyName, insurer, authStr) => {
  const res = await fetch(`${BASE_URL}/admin/policy/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authStr}`,
    },
    body: JSON.stringify({ policyName, insurer }),
  });
  if (!res.ok) throw new Error('Failed to update policy');
  return res.json();
};

export const deletePolicy = async (id, authStr) => {
  const res = await fetch(`${BASE_URL}/admin/policy/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Basic ${authStr}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete policy');
  return res.json();
};
