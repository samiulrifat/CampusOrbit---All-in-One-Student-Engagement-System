import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RSVPButton = ({ eventId, currentUser }) => {
  const [isAttending, setIsAttending] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !currentUser?._id) return;
    axios.get(`/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const attendees = res.data.attendees || [];
        setIsAttending(attendees.some(user => user._id === currentUser._id));
      })
      .catch(console.error);
  }, [eventId, currentUser, token]);

  const toggleRSVP = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const res = await axios.post(`/api/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attendees = res.data.attendees || [];
      setIsAttending(attendees.some(userId => userId.toString() === currentUser._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={toggleRSVP} className="btn btn-primary" disabled={!token || !currentUser || loading}>
      {loading ? 'Processing...' : isAttending ? 'Cancel RSVP' : 'RSVP'}
    </button>
  );
};

export default RSVPButton;
