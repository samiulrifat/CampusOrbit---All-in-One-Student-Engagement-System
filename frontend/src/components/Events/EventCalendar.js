import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [filters, setFilters] = useState({
    category: '',
    clubId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.clubId) params.clubId = filters.clubId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      try {
        const res = await axios.get('/api/events/filter', { params });
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, [filters]);

  // Get events for currently selected date to show details
  const eventsOnDate = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  });

  return (
    <div>
      <h2>Event Calendar</h2>

      {/* Filters */}
      <div>
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="Club ID"
          value={filters.clubId}
          onChange={e => setFilters({ ...filters, clubId: e.target.value })}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={e => setFilters({ ...filters, startDate: e.target.value })}
        />
        <input
          type="date"
          placeholder="End Date"
          value={filters.endDate}
          onChange={e => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div>

      <Calendar onChange={setDate} value={date} />

      <div>
        <h3>Events on {date.toDateString()}</h3>
        {eventsOnDate.length === 0 && <p>No events on this date.</p>}
        <ul>
          {eventsOnDate.map(event => (
            <li key={event._id}>
              <strong>{event.title}</strong> - {new Date(event.date).toLocaleTimeString()}<br />
              Location: {event.location}<br />
              Club: {event.clubId?.name || 'N/A'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventCalendar;
