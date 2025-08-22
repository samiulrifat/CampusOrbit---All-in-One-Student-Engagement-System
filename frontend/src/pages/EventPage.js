import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PhotoGallery from '../components/Events/PhotoGallery';
import PhotoUploadForm from '../components/Events/PhotoUploadForm';
import RSVPButton from '../components/Events/RSVPButton';
import AttendeeList from '../components/Events/AttendeeList';
import { useAuth } from '../context/AuthProvider';

import NotificationBell from '../components/NotificationBell';
import SponsorshipRequestForm from '../components/SponsorshipRequestForm'; // New import

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

    // Update event photos state on successful photo upload
  const handleUploadSuccess = (newPhotos) => {
    setEvent(prev => ({ ...prev, photos: newPhotos }));
  };

  return (
    <div className="container mt-4">

      {/* Top bar with event title and notification bell */}
      <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{event.title}</h1>
        <NotificationBell />
      </div>

      {/* Event description and date */}
      <p>{event.description}</p>
      <p>
        <strong>Date: </strong>
        {new Date(event.date).toLocaleString()}
      </p>

      {/* RSVP button */}
      <RSVPButton eventId={eventId} currentUser={user} />

      {/* Sponsorship Request Form for organizers/admins */}
      {isOrganizer && (
        <div className="mt-5">
          <SponsorshipRequestForm eventId={eventId} />
        </div>
      )}

      <h2>Event Photos</h2>
      <PhotoGallery photos={event.photos || []} />
      {user && (
        <>
          <PhotoUploadForm eventId={eventId} onUploadSuccess={handleUploadSuccess} />
        
          <div className="mt-5">
            <AttendeeList eventId={eventId} />
          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
