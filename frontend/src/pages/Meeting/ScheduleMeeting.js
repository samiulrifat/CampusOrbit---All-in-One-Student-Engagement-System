import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
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

  // Fetch clubs the user belongs to
  useEffect(() => {
    if (!user || !token) return;

    let isCancelled = false;

    async function fetchClubs() {
      try {
        const res = await fetch('http://localhost:5000/api/clubs/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error('Failed to fetch clubs');
        const data = await res.json();
        if (!isCancelled) {
          setClubs(data);
        }
      } catch (error) {
        if (!isCancelled) {
          setClubs([]);
          console.error('Error fetching clubs:', error);
        }
      }
    }
    fetchClubs();
    return () => {
      isCancelled = true; // cleanup to avoid state updates after unmount
    };
  }, [user, token]);


  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== 'club_admin') {
    return <div>You do not have permission to schedule meetings.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!clubId) {
      setError('Please select a club');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          clubId,
          organizerId: user._id, // Automatically set organizer id
          title,
          agenda,
          location,
          scheduledAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to schedule meeting');
        return;
      }

      setMessage('Meeting scheduled successfully!');
      setTitle('');
      setAgenda('');
      setLocation('');
      setScheduledAt('');
      setClubId('');
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card">
        <h2>Schedule a Meeting</h2>
        <div className="meeting-buttons">
          <Link to="/schedule-meeting" className="btn-schedule">Schedule Meeting</Link>
          <Link to="/meetings" className="btn-meeting">Meetings</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Club</label>
            <select value={clubId} onChange={e => setClubId(e.target.value)} required>
              <option value="">-- Select Club --</option>
              {clubs.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
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

          <button type="submit" className="schedule-btn">Schedule Meeting</button>
        </form>

        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}

export default ScheduleMeeting;
