import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth'; // Adjust path if needed

const AttendeeList = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios.get(`/api/events/${eventId}/attendees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAttendees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId, token]);

  const removeAttendee = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this attendee?')) return;
    try {
      await axios.delete(`/api/events/${eventId}/attendees/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendees(prev => prev.filter(a => a._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading attendees...</p>;

  if (!attendees.length) return <p>No attendees to display.</p>;

  return (
    <div>
      <h3>Attendee List</h3>
      <ul>
        {attendees.map(user => (
          <li key={user._id}>
            {user.name} ({user.email})
            {user && user.role === 'clubAdmin' && (
              <button
                onClick={() => removeAttendee(user._id)}
                className="btn btn-sm btn-danger ml-2"
                style={{ marginLeft: '8px' }}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendeeList;
