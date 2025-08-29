// src/pages/Event/EventManager.js

import React, { useState, useEffect, useCallback, useMemo } from "react";
import EventList from "./EventList";
import EventForm from "./EventForm";
import "./EventManager.css";

const API_URL = "/api/events";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState("");

  // Pull token from localStorage
  const token = localStorage.getItem("token");

  // Memoize headers
  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Fetch user's clubs
  const fetchUserClubs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/clubs/user", { headers: authHeaders });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch clubs");
      }
      const data = await res.json();
      setClubs(data);
      if (data.length) setSelectedClubId(data[0]._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  // Fetch events for selected club
  const fetchEvents = useCallback(async () => {
    if (!selectedClubId) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}?clubId=${selectedClubId}`, {
        headers: authHeaders
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch events");
      }
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedClubId, authHeaders]);

  useEffect(() => {
    fetchUserClubs();
  }, [fetchUserClubs]);

  useEffect(() => {
    fetchEvents();
    setEditingEvent(null);
  }, [fetchEvents]);

  const addEvent = async (eventData, photos = []) => {
    setError(null);
    if (!selectedClubId) {
      setError("Please select a club");
      return;
    }

    try {
      const payload = { ...eventData, clubId: selectedClubId };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add event");
      }

      const newEvent = await res.json();

      // Upload photos if any
      if (photos.length) {
        const fd = new FormData();
        photos.forEach((file) => fd.append("photos", file));

        const uploadRes = await fetch(`${API_URL}/${newEvent._id}/photos`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          throw new Error(uploadErr.message || "Failed to upload photos");
        }

        const uploadData = await uploadRes.json();
        newEvent.photos = uploadData.photos || [];
      }

      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      setError(err.message);
    }
  };

  const editEvent = async (eventData, photos = []) => {
    setError(null);
    if (!selectedClubId) {
      setError("Please select a club");
      return;
    }

    try {
      const payload = { ...eventData, clubId: selectedClubId };

      const res = await fetch(`${API_URL}/${eventData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update event");
      }

      const updatedEvent = await res.json();

      if (photos.length) {
        const fd = new FormData();
        photos.forEach((file) => fd.append("photos", file));

        const uploadRes = await fetch(`${API_URL}/${updatedEvent._id}/photos`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          throw new Error(uploadErr.message || "Failed to upload photos");
        }

        const uploadData = await uploadRes.json();
        updatedEvent.photos = uploadData.photos || [];
      }

      setEvents((prev) =>
        prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
      );
      setEditingEvent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEvent = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e._id !== id));
      if (editingEvent?._id === id) setEditingEvent(null);
    } catch (err) {
      setError(err.message);
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
            onChange={(e) => setSelectedClubId(e.target.value)}
          >
            <option value="">-- Select a club --</option>
            {clubs.map((club) => (
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
