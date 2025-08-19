import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const UserAchievements = ({ clubId, userId }) => {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use logged-in userId if not provided
  const effectiveUserId = userId || (user && user._id);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!clubId || !effectiveUserId) return;

    axios.get(`/api/achievements/user/${clubId}/${effectiveUserId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUserAchievements(res.data))
      .catch(err => console.error('Failed to load user achievements:', err))
      .finally(() => setLoading(false));
  }, [clubId, effectiveUserId]);

  if (loading) return <p>Loading your achievements...</p>;
  if (userAchievements.length === 0) return <p>You have no achievements yet.</p>;

  return (
    <div>
      <h3>Your Achievements</h3>
      <ul className="achievement-list">
        {userAchievements.map(({ achievementId }) => (
          <li key={achievementId._id} className="achievement-item">
            {achievementId.iconUrl && (
              <img src={achievementId.iconUrl} alt={achievementId.title} className="achievement-icon" />
            )}
            <div className="achievement-content">
              <strong>{achievementId.title}</strong>
              <p>{achievementId.description || achievementId.criteria}</p>
              <small>Awarded on: {new Date(achievementId.createdAt).toLocaleDateString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserAchievements;
