import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RSVPButton = ({ eventId, currentUser }) => {
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
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

  return React.createElement(
    'button',
    {
      onClick: toggleRSVP,
      className: 'btn btn-primary',
    },
    isAttending ? 'Cancel RSVP' : 'RSVP'
  );
};

export default RSVPButton;
