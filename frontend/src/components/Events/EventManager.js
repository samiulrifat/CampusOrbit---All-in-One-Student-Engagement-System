import React, { useState, useEffect } from "react";
import EventList from "./EventList";
import EventForm from "./EventForm";
import "./Events.css";

const API_URL = "/api/events";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch user clubs whenever component mounts
  useEffect(() => {
    fetchUserClubs();
    // eslint-disable-next-line
  }, []);

  // Fetch events when selectedClubId changes
  useEffect(() => {
    if (selectedClubId) {
      fetchEvents();
    } else {
      setEvents([]); // clear events if no club selected
    }
    // eslint-disable-next-line
  }, [selectedClubId]);

  const fetchUserClubs = async () => {
    try {
      const res = await fetch("/api/clubs/user", { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch clubs");
      const data = await res.json();
      console.log("Fetched clubs:", data);
      setClubs(data);
      if (data.length) setSelectedClubId(data[0]._id);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}?clubId=${selectedClubId}`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event, photos) => {
    try {
      setError(null);
      if (!selectedClubId) throw new Error("Please select a club");
      const eventWithClub = { ...event, clubId: selectedClubId };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(eventWithClub),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add event");
      }
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

  const editEvent = async (event, photos) => {
    try {
      setError(null);
      if (!selectedClubId) throw new Error("Please select a club");
      const eventWithClub = { ...event, clubId: selectedClubId };

      const res = await fetch(`${API_URL}/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(eventWithClub),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update event");
      }
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
      setEvents(prev => prev.map(e => (e._id === updatedEvent._id ? updatedEvent : e)));
      setEditingEvent(null);
    } catch (err) {
      setError(err.message);
    }
  };

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
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <label>
        Select Club:
        <select
          value={selectedClubId}
          onChange={e => setSelectedClubId(e.target.value)}
          style={{ margin: "10px 0", padding: "6px" }}
        >
          <option value="">-- Select a club --</option>
          {clubs.map(club => (
            <option key={club._id} value={club._id}>{club.name}</option>
          ))}
        </select>
      </label>

      <EventForm
        onSubmit={editingEvent ? editEvent : addEvent}
        event={editingEvent}
        onCancel={() => setEditingEvent(null)}
      />

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <EventList events={events} onDelete={deleteEvent} onEdit={setEditingEvent} />
      )}
    </div>
  );
};

export default EventManager;
