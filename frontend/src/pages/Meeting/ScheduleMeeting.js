import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ScheduleMeeting.css';

function ScheduleMeeting() {
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [clubId, setClubId] = useState('');
  const [organizerId, setOrganizerId] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubId,
          organizerId,
          title,
          agenda,
          location,
          scheduledAt
        })
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
    } catch (err) {
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
            <label>Club ID</label>
            <input 
              type="text"
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              placeholder="Enter Club ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Organizer ID</label>
            <input 
              type="text"
              value={organizerId}
              onChange={(e) => setOrganizerId(e.target.value)}
              placeholder="Enter Your User ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Meeting Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div className="form-group">
            <label>Agenda</label>
            <textarea
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Enter meeting agenda"
            />
          </div>

          <div className="form-group">
            <label>Location / Link</label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter physical location or online link"
            />
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <input 
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
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
