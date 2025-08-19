import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RSVPButton from '../components/Events/RSVPButton';
import AttendeeList from '../components/Events/AttendeeList';
import { useAuth } from '../context/AuthProvider'; // Ensure you import from context

import NotificationBell from '../components/NotificationBell'; // <== New import

import './EventPage.css';

const EventPage = () => {
  const { id: eventId } = useParams();
  const { user, loading: userLoading } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view event details.');
      setLoading(false);
      return;
    }

    axios.get(`/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load event:', err);
        setError('Failed to load event. Please try again.');
        setLoading(false);
      });
  }, [eventId]);

  if (loading || userLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Please log in to view event details.</p>;
  if (!event) return <p>No event found.</p>;

  const isOrganizer = ['organizer', 'club_admin', 'admin'].includes(user.role);

  console.log('Current user:', user);
  console.log('Is Organizer:', isOrganizer);
  console.log('Event attendees:', event?.attendees);

  return (
    <div className="container mt-4">

      {/* Added NotificationBell inside a topbar container for layout */}
      <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{event.title}</h1>
        <NotificationBell />
      </div>

      <p>{event.description}</p>
      <p>
        <strong>Date: </strong>
        {new Date(event.date).toLocaleString()}
      </p>

      <RSVPButton eventId={eventId} currentUser={user} />

      {isOrganizer && (
        <div className="mt-5">
          <AttendeeList eventId={eventId} />
        </div>
      )}
    </div>
  );
};

export default EventPage;
