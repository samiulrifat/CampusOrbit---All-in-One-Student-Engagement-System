import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
import { createMeeting as apiCreateMeeting } from '../../api/clubApi';
import './ScheduleMeeting.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function ScheduleMeeting() {
  const { user, loading, token } = useAuth();
  const [clubs, setClubs] = useState([]); // array of club objects or clubId strings (cached)
  const [selectedClub, setSelectedClub] = useState('');
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // render debug
  console.debug('ScheduleMeeting render', { user, tokenPresent: !!token, clubs, selectedClub });

  const fetchClubs = useCallback(async () => {
    try {
      const t = token || localStorage.getItem('token');
      console.debug('fetchClubs: tokenPresent=', !!t);

      // optimistic cached clubs from localStorage.user
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (storedUser && (storedUser.clubsJoined || storedUser.clubId)) {
          const cached = storedUser.clubsJoined || (storedUser.clubId ? [storedUser.clubId] : []);
          console.debug('fetchClubs: using cached clubs from localStorage', cached);
          // only set if we don't already have objects from API
          if (!clubs.length) setClubs(cached);
        }
      } catch (err) {
        console.debug('fetchClubs: no valid stored user', err);
      }

      if (!t) {
        console.warn('fetchClubs: no token, skipping API call');
        return;
      }

      const res = await axios.get(`${API_BASE}/api/clubs/user`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      if (res && res.status === 200) {
        setClubs(res.data || []);
        console.debug('fetchClubs: loaded clubs from API', res.data);
      } else {
        console.warn('fetchClubs: unexpected status', res.status, res.data);
        setClubs(prev => (Array.isArray(prev) ? prev : []));
      }
    } catch (err) {
      console.error('fetchClubs failed', err?.response?.status, err?.response?.data || err.message);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setClubs([]);
        setError('Not authenticated. Please login again.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (loading) return;
    fetchClubs();
  }, [loading, fetchClubs]);

  // tolerant handler: works with both form submit event and manual onClick()
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    console.debug('handleSubmit start', { selectedClub, title, scheduledAt, user, tokenPresent: !!token });
    setError('');
    setMessage('');
    setIsSubmitting(true);

    const t = token || localStorage.getItem('token');
    if (!t || !user) {
      setError('Invalid user, please login');
      console.warn('ScheduleMeeting: missing user/token', { user, token: !!token });
      setIsSubmitting(false);
      return;
    }

    if (!selectedClub || !title || !scheduledAt) {
      setError('Please fill required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { title, agenda, location, scheduledAt: new Date(scheduledAt).toISOString() };
      console.debug('POST payload', { url: `${API_BASE}/api/meetings/${selectedClub}`, payload });
      const res = await apiCreateMeeting(selectedClub, payload, t);
      console.debug('createMeeting response', res?.data);
      setMessage('Meeting scheduled');
      setTitle(''); setAgenda(''); setLocation(''); setScheduledAt(''); setSelectedClub('');
      setIsSubmitting(false);
    } catch (err) {
      console.error('create meeting error', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create meeting');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card" role="region" aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">Schedule Meeting</h2>

        {error && <div className="error-msg" role="alert">{error}</div>}
        {message && <div className="success-msg" role="status">{message}</div>}

        <form onSubmit={handleSubmit} aria-describedby="schedule-help">
          <div className="form-group">
            <label htmlFor="club-select">Club</label>
            <select
              id="club-select"
              value={selectedClub}
              onChange={e => setSelectedClub(e.target.value)}
            >
              <option value="">Select club</option>
              {clubs.map((c) => {
                const id = (typeof c === 'string') ? c : (c._id || c.id);
                const name = (typeof c === 'string') ? c : (c.name || c.title || c.clubName || id);
                return <option key={id} value={id}>{name}</option>;
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title-input">Title</label>
            <input id="title-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="agenda-input">Agenda</label>
            <textarea id="agenda-input" value={agenda} onChange={e => setAgenda(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="location-input">Location</label>
            <input id="location-input" value={location} onChange={e => setLocation(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="datetime-input">Date & Time</label>
            <input id="datetime-input" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
          </div>

          <button
            type="submit"
            className="schedule-btn"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule'}
          </button>

          <p id="schedule-help" style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            Meetings are visible to club members. You must be logged in as an officer to create.
          </p>
        </form>
      </div>
    </div>
  );
}