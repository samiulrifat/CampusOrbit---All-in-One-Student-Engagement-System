import React from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const ANNOUNCEMENTS_API = 'http://localhost:5000/api/announcements';

const AnnouncementItem = ({ announcement, user, clubId }) => {
  const { user: authUser } = useAuth();

  const userRole = user?.role || ''; // adjust as per your auth user object shape
  const canDelete = ['officer', 'club_admin'].includes(userRole);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${ANNOUNCEMENTS_API}/${clubId}/${announcement._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh page or signal parent to refresh (can be via props callback or context)
      window.location.reload(); // Simple approach; better to use state in parent to refresh list
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      alert(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="announcement-item" style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}>
      <h3>{announcement.title}</h3>
      <p>{announcement.content}</p>
      <small>
        Posted by {announcement.author?.name || 'Unknown'} on {new Date(announcement.createdAt).toLocaleString()}
      </small>
      {canDelete && (
        <button onClick={handleDelete} style={{ color: 'red', marginTop: '0.5rem', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>
          Delete
        </button>
      )}
    </div>
  );
};

export default AnnouncementItem;
