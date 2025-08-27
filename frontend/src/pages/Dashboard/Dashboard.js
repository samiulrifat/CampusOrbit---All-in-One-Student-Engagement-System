import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, loading, token } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [polls, setPolls] = useState([]);

  const fetchMemberClubs = async () => {
    if (!user?._id) return [];
    try {
      const res = await axios.get(`http://localhost:5000/api/clubs?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClubs(res.data || []);
      return (res.data || []).map(c => String(c._id));
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
      return [];
    }
  };

  const fetchAnnouncements = async (clubIds) => {
    if (!clubIds.length) return;
    try {
      const res = await axios.get('http://localhost:5000/api/announcements', {
        headers: { Authorization: `Bearer ${token}` },
        params: { clubIds: clubIds.join(',') }
      });
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    }
  };

  const fetchMeetings = async (clubIds) => {
    if (!clubIds.length) return;
    try {
      const res = await axios.get('http://localhost:5000/api/meetings', {
        headers: { Authorization: `Bearer ${token}` },
        params: { clubIds: clubIds.join(',') }
      });
      setMeetings(res.data || []);
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
    }
  };

  const fetchPolls = async (clubIds) => {
    if (!clubIds.length) return;
    try {
      const res = await axios.get('http://localhost:5000/api/polls', {
        headers: { Authorization: `Bearer ${token}` },
        params: { clubIds: clubIds.join(',') }
      });
      setPolls(res.data || []);
    } catch (err) {
      console.error('Failed to fetch polls:', err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user || !token) return;

    // Non-admin member dashboard
    if (user.role !== 'club_admin') {
      fetchMemberClubs().then((clubIds) => {
        if (clubIds.length > 0) {
          Promise.allSettled([
            fetchAnnouncements(clubIds),
            fetchMeetings(clubIds),
            fetchPolls(clubIds)
          ]).then(() => {});
        }
      });
    }
  }, [user, token, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your dashboard</div>;

  const isAdmin = user.role === 'club_admin';

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user.name}</h1>
      {isAdmin ? (
        <div>
          {/* Existing admin actions here */}
        </div>
      ) : (
        <div>
          <h2>Your Clubs</h2>
          {clubs.map((club) => (
            <div key={club._id}>
              <h3>{club.name}</h3>
            </div>
          ))}

          <h2>Announcements</h2>
          {announcements.map(a => (
            <div key={a._id}>{a.title}</div>
          ))}

          <h2>Meetings</h2>
          {meetings.map(m => (
            <div key={m._id}>{m.title} - {new Date(m.scheduledAt).toLocaleString()}</div>
          ))}

          <h2>Polls</h2>
          {polls.map(p => (
            <div key={p._id}>{p.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
