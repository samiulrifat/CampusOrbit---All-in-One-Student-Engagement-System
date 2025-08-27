import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ScheduleMeeting.css';

function ScheduleMeeting() {
  const { user, loading, token } = useAuth();

  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_CLUBS_URL = "http://localhost:5000/api/clubs";

  useEffect(() => {
    if (!token) return;

    const fetchClubs = async () => {
      try {
        const res = await axios.get(API_CLUBS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(res.data);
      } catch (err) {
        console.error('Failed to fetch clubs:', err.response || err);
        setClubs([]);
      }
    };

    fetchClubs();
  }, [!!token]);  // Use boolean instead of full token string


const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submit clicked');
  setMessage('');
  setError('');

  console.log('clubId:', clubId, 'title:', title, 'scheduledAt:', scheduledAt);

  if (!clubId) {
    setError('Please select a club');
    return;
  }

  if (!token || !user) {
    setError('User not authenticated');
    return;
  }

  try {
    console.log('Before axios post');
    const res = await axios.post(
      'http://localhost:5000/api/meetings',
      {
        clubId,
        organizerId: user._id,
        title,
        agenda,
        location,
        scheduledAt,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('After axios post', res);

    if (res.status === 201) {
      setMessage('Meeting scheduled successfully!');
      setTitle('');
      setAgenda('');
      setLocation('');
      setScheduledAt('');
      setClubId('');
    } else {
      setError('Failed to schedule meeting');
    }
  } catch (err) {
    console.error('Schedule Meeting error:', err.response || err);
    setError(err.response?.data?.error || 'Something went wrong');
  }
};

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>You do not have permission to schedule meetings.</div>;

  return (
    <div className="schedule-page">
      <div className="schedule-card">
        <h2>Schedule a Meeting</h2>
        <div className="meeting-buttons">
          <Link to="/schedule-meeting" className="btn-schedule">
            Schedule Meeting
          </Link>
          <Link to="/meetings" className="btn-meeting">
            Meetings
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Club</label>
            <select value={clubId} onChange={e => setClubId(e.target.value)} required>
              <option value="">-- Select Club --</option>
              {clubs.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div className="form-group">
            <label>Agenda</label>
            <textarea
              value={agenda}
              onChange={e => setAgenda(e.target.value)}
              placeholder="Enter meeting agenda"
            />
          </div>

          <div className="form-group">
            <label>Location / Link</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Enter physical location or online link"
            />
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="schedule-btn">
            Schedule Meeting
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}

export default ScheduleMeeting;
