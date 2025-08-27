import React from 'react';
import api from '../../api';

const AnnouncementItem = ({ announcement, user, clubId, onDelete }) => {
  const userRole = user?.role || '';
  const canDelete = ['officer', 'club_admin'].includes(userRole);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${clubId}/${announcement._id}`);
      // Instead of forcing a full reload, let parent refresh
      if (onDelete) {
        onDelete(announcement._id);
      } else {
        window.location.reload();
      }
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
