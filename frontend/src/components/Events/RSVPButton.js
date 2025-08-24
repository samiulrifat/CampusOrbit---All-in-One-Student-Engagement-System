import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RSVPButton = ({ eventId, currentUser }) => {
  const [isAttending, setIsAttending] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !currentUser?.id) return;  // Added optional chaining here
    axios.get(`/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const attendees = res.data.attendees || [];
        setIsAttending(attendees.some(user => user._id === currentUser.id));
      })
      .catch(console.error);
  }, [eventId, currentUser, token]);

  const toggleRSVP = async () => {
    if (!currentUser?.id) return;  // Defensive check
    try {
      const res = await axios.post(`/api/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attendees = res.data.attendees || [];
      setIsAttending(attendees.some(userId => userId.toString() === currentUser.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={toggleRSVP} className="btn btn-primary" disabled={!token || !currentUser}>
      {isAttending ? 'Cancel RSVP' : 'RSVP'}
    </button>
  );
};

export default RSVPButton;
