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
      if (onCreate) onCreate(); // inform parent to refresh announcements list
    } catch (err) {
      console.error('Failed to post announcement:', err);
      alert(err.response?.data?.message || 'Failed to post announcement');
    }
    setPosting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input
        type="text"
        placeholder="Announcement title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', fontSize: '1rem' }}
      />
      <textarea
        placeholder="Write announcement..."
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', height: '100px', fontSize: '1rem' }}
      />
      <button type="submit" disabled={posting} style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginTop: '0.5rem' }}>
        {posting ? 'Posting...' : 'Post Announcement'}
      </button>
    </form>
  );
};

export default AnnouncementForm;
