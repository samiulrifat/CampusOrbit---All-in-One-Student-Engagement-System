import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RSVPButton from '../components/Events/RSVPButton';
import AttendeeList from '../components/Events/AttendeeList';
import useAuth from '../hooks/useAuth';

import './EventPage.css';

const EventPage = () => {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`/api/events/${eventId}`)
      .then(res => setEvent(res.data))
      .catch(console.error);
  }, [eventId]);

  if (!event) {
    return <p>Loading event…</p>;
  }

  return (
    <div className="container mt-4">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>
        <strong>Date: </strong>
        {new Date(event.date).toLocaleString()}
      </p>

      <RSVPButton eventId={eventId} currentUser={user} />

      {user.role === 'organizer' && (
        <div className="mt-5">
          <AttendeeList eventId={eventId} />
        </div>
      )}
    </div>
  );
};

export default EventPage;
