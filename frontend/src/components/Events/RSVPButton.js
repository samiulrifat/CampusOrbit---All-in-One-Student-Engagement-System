import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RSVPButton = ({ eventId, currentUser }) => {
  const [isAttending, setIsAttending] = useState(false);
  const token = localStorage.getItem('token'); // Retrieve JWT token

  useEffect(() => {
    if (!token) return; // No token means not logged in
    axios.get(`/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const attendees = res.data.attendees || [];
        setIsAttending(attendees.some(user => user._id === currentUser.id));
      })
      .catch(console.error);
  }, [eventId, currentUser.id, token]);

  const toggleRSVP = async () => {
    try {
      const res = await axios.post(`/api/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attendees = res.data.attendees || [];
      setIsAttending(attendees.some(userId => userId === currentUser.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={toggleRSVP} className="btn btn-primary">
      {isAttending ? 'Cancel RSVP' : 'RSVP'}
    </button>
  );
};

export default RSVPButton;
