import React, { useState, useEffect } from "react";
import EventList from "./EventList";
import EventForm from "./EventForm";
import "./Events.css";

const API_URL = "/api/events"; // Use proxy in package.json!

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // JWT from login

  // Standard auth headers for protected backend endpoints
  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  // Fetch
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const addEvent = async (event, photos) => {
    try {
      setError(null);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error("Failed to add event");
      const newEvent = await res.json();

      if (photos && photos.length) {
        const fd = new FormData();
        photos.forEach(photo => fd.append("photos", photo));
        const uploadRes = await fetch(`${API_URL}/${newEvent._id}/photos`, {
          method: "POST",
          headers: authHeaders,
          body: fd,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          newEvent.photos = uploadData.photos;
        }
      }
      setEvents(prev => [...prev, newEvent]);
    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATE
  const editEvent = async (event, photos) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error("Failed to update event");
      const updatedEvent = await res.json();

      if (photos && photos.length) {
        const fd = new FormData();
        photos.forEach(photo => fd.append("photos", photo));
        const uploadRes = await fetch(`${API_URL}/${updatedEvent._id}/photos`, {
          method: "POST",
          headers: authHeaders,
          body: fd,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          updatedEvent.photos = uploadData.photos;
        }
      }
      setEvents(prev =>
        prev.map(e => (e._id === updatedEvent._id ? updatedEvent : e))
      );
      setEditingEvent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE
  const deleteEvent = async (id) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="event-manager">
      <h2>Manage CampusOrbit Events</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <EventForm
        onSubmit={editingEvent ? editEvent : addEvent}
        event={editingEvent}
        onCancel={() => setEditingEvent(null)}
      />

      {loading ? <p>Loading events...</p>
        : <EventList events={events} onDelete={deleteEvent} onEdit={setEditingEvent} />
      }
    </div>
  );
};

export default EventManager;
