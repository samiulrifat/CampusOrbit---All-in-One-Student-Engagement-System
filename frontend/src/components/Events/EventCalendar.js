import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './EventCalendar.css';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    clubId: '',
    startDate: '',
    endDate: ''
  });

  // Fetch clubs for dropdown filter
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    axios.get('/api/clubs')
      .then(res => setClubs(res.data))
      .catch(err => {
        console.error('Failed to fetch clubs:', err);
      });
  }, []);

  // Fetch events with filters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events/filter', { params: filters });
        setEvents(res.data.map(e => ({
          id: e._id,
          title: e.title,
          start: e.date,
          display: 'block',
          backgroundColor: '#3788d8',
          borderColor: '#3788d8',
          extendedProps: {
            location: e.location,
            category: e.category,
            club: e.clubId?.name
          }
        })));
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };
    fetchEvents();
  }, [filters]);

  // Render event content with location shown below title
  function renderEventContent(eventInfo) {
    return (
      <div style={{ fontSize: '0.85em' }}>
        <b>{eventInfo.event.title}</b>
        <div style={{ fontSize: '0.75em', color: '#eee' }}>
          {eventInfo.event.extendedProps.location || 'No Location'}
        </div>
      </div>
    );
  }

  // Handle event click to show detailed info
  const handleEventClick = (info) => {
    const { title, extendedProps } = info.event;
    alert(
      `Event: ${title}\nLocation: ${extendedProps.location || 'N/A'}\nCategory: ${extendedProps.category || 'N/A'}\nClub: ${extendedProps.club || 'N/A'}`
    );
  };

  // Reset filters
  const clearFilters = () => {
    setFilters({ category: '', clubId: '', startDate: '', endDate: '' });
  };

  return (
    <div className="calendar-page">
      <h2 className="calendar-title">Event Calendar</h2>
      <div className="calendar-filters">
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Academic">Academic</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
          <option value="Tech">Tech</option>
          <option value="Social">Social</option>
        </select>
        <select value={filters.clubId} onChange={e => setFilters({ ...filters, clubId: e.target.value })}>
          <option value="">All Clubs</option>
          {clubs.map(club => (
            <option key={club._id} value={club._id}>{club.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={e => setFilters({ ...filters, startDate: e.target.value })}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={e => setFilters({ ...filters, endDate: e.target.value })}
          placeholder="End Date"
        />
        <button onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
      />
    </div>
  );
};

export default EventCalendar;
