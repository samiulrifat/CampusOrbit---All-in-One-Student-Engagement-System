import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendeeList = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    axios.get(`/api/events/${eventId}/attendees`)
      .then(res => setAttendees(res.data))
      .catch(console.error);
  }, [eventId]);

  const removeAttendee = async (userId) => {
    try {
      await axios.delete(`/api/events/${eventId}/attendees/${userId}`);
      setAttendees(prev => prev.filter(a => a._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return React.createElement(
    'div',
    null,
    React.createElement('h3', null, 'Attendee List'),
    React.createElement(
      'ul',
      null,
      attendees.map(user =>
        React.createElement(
          'li',
          { key: user._id },
          `${user.name} (${user.email})`,
          React.createElement(
            'button',
            {
              onClick: () => removeAttendee(user._id),
              className: 'btn btn-sm btn-danger ml-2'
            },
            'Remove'
          )
        )
      )
    )
  );
};

export default AttendeeList;
