import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AnnouncementList from '../../components/Announcements/AnnouncementList';
import AnnouncementForm from '../../components/Announcements/AnnouncementForm';
import useAuth from "../../hooks/useAuth";
import './Announcements.css';

const Announcements = () => {
  const { clubId } = useParams();
  const { user } = useAuth();
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleRefresh = () => setRefreshCounter(prev => prev + 1);
  if (!user) return null;

  const isAdmin = user.role === 'club_admin';

  return (
    <div className="announcements-page">
      <div className="announcements-card">
        <h1>Club Announcements</h1>
        { isAdmin ? (
          <>
          <AnnouncementForm clubId={clubId} onCreate={handleRefresh} />
          <AnnouncementList clubId={clubId} refresh={refreshCounter} />
          </>
        ) : (
          <AnnouncementList clubId={clubId} refresh={refreshCounter} />
        )}
      </div>
    </div>
  );
};

export default Announcements;
