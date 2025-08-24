import React from 'react';
import axios from 'axios';

const ANNOUNCEMENTS_API = 'http://localhost:5000/api/announcements';

const AnnouncementItem = ({ announcement, user, clubId }) => {
  const userRole = user?.role || '';
  const canDelete = ['officer', 'club_admin'].includes(userRole);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${ANNOUNCEMENTS_API}/${clubId}/${announcement._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      alert(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="announcement-item">
      <h3>{announcement.title}</h3>
      <p>{announcement.content}</p>
      <small>
        Posted by {announcement.author?.name || 'Unknown'} on{' '}
        {new Date(announcement.createdAt).toLocaleString()}
      </small>
      {canDelete && (
        <button onClick={handleDelete} className="delete-btn">
          Delete
        </button>
      )}
    </div>
  );
};

export default AnnouncementItem;
