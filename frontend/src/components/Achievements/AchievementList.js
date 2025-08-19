import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AchievementList = ({ clubId }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!clubId) return;

    axios.get(`/api/achievements/${clubId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAchievements(res.data))
      .catch(err => console.error('Failed to fetch achievements:', err))
      .finally(() => setLoading(false));
  }, [clubId]);

  if (loading) return <p>Loading achievements...</p>;
  if (achievements.length === 0) return <p>No achievements defined yet.</p>;

  return (
    <div>
      <h3>Club Achievements</h3>
      <ul className="achievement-list">
        {achievements.map(ach => (
          <li key={ach._id} className="achievement-item">
            {ach.iconUrl && (
              <img src={ach.iconUrl} alt={ach.title} className="achievement-icon" />
            )}
            <div className="achievement-content">
              <strong>{ach.title}</strong>
              <p>{ach.description || ach.criteria}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AchievementList;
