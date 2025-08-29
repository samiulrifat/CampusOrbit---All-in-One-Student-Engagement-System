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
    <div>
      <div>
        <form onSubmit={handleSubmit} className="achievement-form">
          <h3>Create Achievement</h3>

          <div className="form-group">
            <label>Title (required):</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Icon URL:</label>
            <input
              type="text"
              value={iconUrl}
              onChange={e => setIconUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Criteria:</label>
            <textarea
              value={criteria}
              onChange={e => setCriteria(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Creating...' : 'Create Achievement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAchievement;
