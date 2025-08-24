import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ResourceList from '../../components/Resources/ResourceList';
import UploadResource from '../../components/Resources/UploadResource';

import './ClubWorkspace.css';

const ClubWorkspace = () => {
  const { clubId } = useParams(); // <--- get clubId from route params
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshCounter(prev => prev + 1); // Trigger ResourceList refresh
  };

  if (!clubId) {
    return <p>Invalid club ID. Cannot load workspace.</p>;
  }

  return (
    <div className="club-workspace">
      <h2 className="club-title">Club Workspace</h2>
      <p className="club-subtitle">Upload and share resources with your club members</p>

      <UploadResource clubId={clubId} onUploadSuccess={handleUploadSuccess} />

      <ResourceList key={refreshCounter} clubId={clubId} />
    </div>
  );
};

export default ClubWorkspace;
