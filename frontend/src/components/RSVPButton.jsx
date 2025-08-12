// components/RSVPButton.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RSVPButton = ({ eventId, currentUser }) => {
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    // Fetch event to see if currentUser is in attendees
    axios.get(`/api/events/${eventId}`)
      .then(res => {
        setIsAttending(res.data.attendees.includes(currentUser.id));
      })
      .catch(console.error);
  }, [eventId, currentUser.id]);

  const toggleRSVP = async () => {
    try {
      const res = await axios.post(`/api/events/${eventId}/rsvp`);
      setIsAttending(res.data.attendees.includes(currentUser.id));
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

