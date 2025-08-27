import React, { useState, useEffect } from 'react';
import { getAnnouncements } from '../../api';
import useAuth from '../../hooks/useAuth';
import AnnouncementItem from './AnnouncementItem';

const AnnouncementList = ({ clubId, refresh }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
          const data = await getAnnouncements(clubId);
          setAnnouncements(data);
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
