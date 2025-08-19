import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AwardAchievement = ({ clubId, onAward }) => {
  const [achievements, setAchievements] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [awarding, setAwarding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!clubId) return;

    // Fetch achievements for the club
    axios.get(`/api/achievements/${clubId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAchievements(res.data))
      .catch(err => console.error('Failed to load achievements:', err));

    // Fetch club members (assumes API exists)
    axios.get(`/api/clubs/${clubId}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMembers(res.data))
      .catch(err => console.error('Failed to load members:', err))
      .finally(() => setLoading(false));
  }, [clubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAchievement || !selectedUser) {
      alert('Please select both achievement and member');
      return;
    }
    setAwarding(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/achievements/award/${clubId}`, {
        achievementId: selectedAchievement,
        userId: selectedUser
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Achievement awarded successfully');
      setSelectedAchievement('');
      setSelectedUser('');
      if (onAward) onAward();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to award achievement');
      console.error(err);
    }
    setAwarding(false);
  };

  if (loading) return <p>Loading form...</p>;

  return (
    <form onSubmit={handleSubmit} className="award-form">
      <h3>Award Achievement</h3>

      <label>
        Select Achievement:
        <select
          value={selectedAchievement}
          onChange={e => setSelectedAchievement(e.target.value)}
          required
        >
          <option value="">-- Select achievement --</option>
          {achievements.map(a => (
            <option key={a._id} value={a._id}>{a.title}</option>
          ))}
        </select>
      </label>

      <label>
        Select Member:
        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          required
        >
          <option value="">-- Select member --</option>
          {members.map(m => (
            <option key={m._id} value={m._id}>{m.name || m.email}</option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={awarding}>
        {awarding ? 'Awarding...' : 'Award Achievement'}
      </button>
    </form>
  );
};

export default AwardAchievement;
