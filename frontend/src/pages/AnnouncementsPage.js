import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AnnouncementList from '../components/Announcements/AnnouncementList';
import AnnouncementForm from '../components/Announcements/AnnouncementForm';

const AnnouncementsPage = () => {
  const { clubId } = useParams();
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleRefresh = () => setRefreshCounter(prev => prev + 1);

  return (
    <div className="announcements-page-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Club Announcements</h1>
      <AnnouncementForm clubId={clubId} onCreate={handleRefresh} />
      <AnnouncementList clubId={clubId} refresh={refreshCounter} />
    </div>
  );
};

export default AnnouncementsPage;
