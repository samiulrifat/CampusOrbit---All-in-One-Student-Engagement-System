import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RSVPButton from '../components/RSVPButton';
import AttendeeList from '../components/AttendeeList';
import useAuth from '../hooks/useAuth';

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
    return React.createElement('p', null, 'Loading event…');
  }

  const rsvpButton = React.createElement(RSVPButton, {
    eventId: eventId,
    currentUser: user
  });

  const attendeeList = user.role === 'organizer'
    ? React.createElement(
        'div',
        { className: 'mt-5' },
        React.createElement(AttendeeList, { eventId: eventId })
      )
    : null;

  return React.createElement(
    'div',
    { className: 'container mt-4' },
    React.createElement('h1', null, event.title),
    React.createElement('p', null, event.description),
    React.createElement(
      'p',
      null,
      React.createElement('strong', null, 'Date: '),
      new Date(event.date).toLocaleString()
    ),
    rsvpButton,
    attendeeList
  );
};

export default EventPage;
