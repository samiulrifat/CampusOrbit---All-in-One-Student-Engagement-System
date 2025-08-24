import React, { useState } from 'react';
import axios from 'axios';

const ANNOUNCEMENTS_API = 'http://localhost:5000/api/announcements';

const AnnouncementForm = ({ clubId, onCreate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPosting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ANNOUNCEMENTS_API}/${clubId}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setContent('');
      if (onCreate) onCreate();
    } catch (err) {
      console.error('Failed to post announcement:', err);
      alert(err.response?.data?.message || 'Failed to post announcement');
    }
    setPosting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="announcement-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Announcement title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Write announcement..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={posting} className="login-btn">
        {posting ? 'Posting...' : 'Post Announcement'}
      </button>
    </form>
  );
};

export default AnnouncementForm;
