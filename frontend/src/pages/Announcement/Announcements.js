import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementList from './AnnouncementList';
import useAuth from "../../hooks/useAuth";
import './Announcements.css';

const Announcements = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const API_URL = "http://localhost:5000/api/clubs";
  const token = localStorage.getItem("token");

  const fetchClubs = useCallback(async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs(res.data);
    } catch (err) {
      console.error("Error fetching clubs:", err.response?.data || err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
    }
  }, [API_URL, token]);

  useEffect(() => {
    if (user && token) {
      fetchClubs();
    }
  }, [user, token, fetchClubs]);


  const handleRefresh = () => setRefreshCounter(prev => prev + 1);

  if (!user) return <p>Please login to view announcements.</p>;
  if (!clubs) return <p>Please login to view announcements.</p>;

  return (
    <div className="announcements-page">
      <div className="announcements-card">
        <h1>Club Announcements</h1>

        {/* Club Selection */}
        <div className="club-selection">
          <h2>Select a Club</h2>
          {clubs.length === 0 ? (
            <p>No clubs available.</p>
          ) : (
            clubs.map((club) => (
              <div
                key={club._id}
                className={`club-item ${selectedClub?._id === club._id ? 'selected' : ''}`}
                onClick={() => setSelectedClub(club)}
              >
                {club.name}
              </div>
            ))
          )}
        </div>

        {/* Announcement Panel */}
        {selectedClub && (
          <div className="announcement-panel">
            <h2>Announcements for "{selectedClub.name}"</h2>
            {user.role === 'club_admin' && (
              <AnnouncementForm clubId={selectedClub._id} onCreate={handleRefresh} />
            )}
            <AnnouncementList clubId={selectedClub._id} refresh={refreshCounter} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
