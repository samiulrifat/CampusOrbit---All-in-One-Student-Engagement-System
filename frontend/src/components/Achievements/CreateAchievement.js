import React, { useState } from 'react';
import axios from 'axios';

const CreateAchievement = ({ clubId, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [criteria, setCriteria] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title) {
      alert('Title is required');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/achievements/${clubId}`, {
        title, description, iconUrl, criteria
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Achievement created successfully!');
      setTitle('');
      setDescription('');
      setIconUrl('');
      setCriteria('');
      if (onCreate) onCreate();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create achievement');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>Create Achievement</h3>
      <label>
        Title (required):
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <label>
        Icon URL:
        <input value={iconUrl} onChange={e => setIconUrl(e.target.value)} />
      </label>
      <label>
        Criteria:
        <textarea value={criteria} onChange={e => setCriteria(e.target.value)} />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Achievement'}
      </button>
    </form>
  );
};

export default CreateAchievement;
