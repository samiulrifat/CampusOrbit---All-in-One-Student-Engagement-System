import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import AnnouncementItem from './AnnouncementItem';

const ANNOUNCEMENTS_API = 'http://localhost:5000/api/announcements';

const AnnouncementList = ({ clubId, refresh }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${ANNOUNCEMENTS_API}/${clubId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnnouncements(res.data);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    if (clubId) fetchAnnouncements();
  }, [clubId, refresh]);

  if (loading) return <p>Loading announcements...</p>;

  return (
    <div>
      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        announcements.map(a => (
          <AnnouncementItem key={a._id} announcement={a} user={user} clubId={clubId} />
        ))
      )}
    </div>
  );
};

export default AnnouncementList;
