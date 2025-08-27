// src/pages/Event/EventManager.js
import React, { useState, useEffect } from "react";
import EventList from "./EventList";
import EventForm from "./EventForm";
import "./EventManager.css";

// import helpers from api.js
import {
  getClubs,              // GET /api/clubs
  getEvents,             // GET /api/events?clubId=...
  createEvent,           // POST /api/events
  updateEvent,           // PUT /api/events/:id
  deleteEvent as apiDel, // DELETE /api/events/:id
} from "../../api";

const EventManager = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState("");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load clubs once
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClubs();     // uses /api and JWT from api.js
        if (cancelled) return;
        setClubs(data);
        if (data?.length) setSelectedClubId(data[0]._id);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to fetch clubs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Load events whenever selected club changes
  useEffect(() => {
    let cancelled = false;
    if (!selectedClubId) { setEvents([]); return; }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEvents({ clubId: selectedClubId }); // GET /api/events?clubId=...
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to fetch events");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedClubId]);

  // Create
  const addEvent = async (eventData /*, photos = [] */) => {
    setError(null);
    if (!selectedClubId) return setError("Please select a club");

    try {
      const payload = { ...eventData, clubId: selectedClubId };
      const newEvent = await createEvent(payload);
      setEvents(prev => [...prev, newEvent]);
      // If you later add photo upload, we can hook it here.
    } catch (e) {
      setError(e.message || "Failed to add event");
    }
  };

  // Update
  const editEvent = async (eventData /*, photos = [] */) => {
    setError(null);
    if (!selectedClubId) return setError("Please select a club");

    try {
      const payload = { ...eventData, clubId: selectedClubId };
      const updated = await updateEvent(eventData._id, payload);
      setEvents(prev => prev.map(e => (e._id === updated._id ? updated : e)));
      setEditingEvent(null);
    } catch (e) {
      setError(e.message || "Failed to update event");
    }
  };

  // Delete
  const deleteEvent = async (id) => {
    setError(null);
    try {
      await apiDel(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      if (editingEvent?._id === id) setEditingEvent(null);
    } catch (e) {
      setError(e.message || "Failed to delete event");
    }
  };

  return (
    <div className="events-page">
      <div className="events-card">
        <h2>Manage CampusOrbit Events</h2>

        {error && <p className="error-msg">{error}</p>}

        <label className="club-select">
          Select Club:
          <select
            value={selectedClubId}
            onChange={e => setSelectedClubId(e.target.value)}
          >
            <option value="">-- Select a club --</option>
            {clubs.map(club => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
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
          <EventList
            events={events}
            onDelete={deleteEvent}
            onEdit={setEditingEvent}
          />
        )}
      </div>
    </div>
  );
};

export default EventManager;
