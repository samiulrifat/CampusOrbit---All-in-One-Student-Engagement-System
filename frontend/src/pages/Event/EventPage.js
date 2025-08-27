import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhotoGallery from '../../components/Resources/PhotoGallery';
import PhotoUploadForm from '../../components/Resources/PhotoUploadForm';
import RSVPButton from '../../components/Resources/RSVPButton';
import AttendeeList from '../../components/Resources/AttendeeList';
import { useAuth } from '../../context/AuthProvider';
import NotificationBell from '../../components/Resources/NotificationBell';
import SponsorshipRequestForm from '../../components/Resources/SponsorshipRequestForm';
import { getEvent } from '../../api';       // <-- use helper
import './EventPage.css';

const EventPage = () => {
  const { id: eventId } = useParams();
  const { user, loading: userLoading } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // PrivateRoute already requires login; we still guard here
    if (!localStorage.getItem('token')) {
      setError('You must be logged in to view event details.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getEvent(eventId);
        setEvent(data);
      } catch (e) {
        console.error('Failed to load event:', e);
        setError('Failed to load event. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  if (loading || userLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Please log in to view event details.</p>;
  if (!event) return <p>No event found.</p>;

  const isOrganizer = ['organizer', 'club_admin', 'admin'].includes(user.role);

  const handleUploadSuccess = (newPhotos) => {
    setEvent(prev => ({ ...prev, photos: newPhotos }));
  };

  return (
    <div className="container mt-4">
      <div className="topbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1>{event.title}</h1>
        <NotificationBell />
      </div>

      <p>{event.description}</p>
      <p><strong>Date: </strong>{new Date(event.date).toLocaleString()}</p>

      <RSVPButton eventId={eventId} currentUser={user} />

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
