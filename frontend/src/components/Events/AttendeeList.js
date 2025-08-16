import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendeeList = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);
  const token = localStorage.getItem('token'); // JWT token from login

  useEffect(() => {
    if (!token) return;

    axios.get(`/api/events/${eventId}/attendees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAttendees(res.data))
      .catch(console.error);
  }, [eventId, token]);

  const removeAttendee = async (userId) => {
    try {
      await axios.delete(`/api/events/${eventId}/attendees/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendees(prev => prev.filter(a => a._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Attendee List</h3>
      <ul>
        {attendees.map(user => (
          <li key={user._id}>
            {user.name} ({user.email})
            <button
              onClick={() => removeAttendee(user._id)}
              className="btn btn-sm btn-danger ml-2"
              style={{ marginLeft: '8px' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendeeList;
