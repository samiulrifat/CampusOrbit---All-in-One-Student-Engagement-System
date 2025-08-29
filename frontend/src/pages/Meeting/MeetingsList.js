import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import './MeetingsList.css';

function MeetingsList() {
  const { user, loading, token } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || !token) return;

    const fetchAllMeetings = async () => {
      setLoadingMeetings(true);
      try {
        let allMeetings = [];

        for (const club of user.clubsJoined || []) {
          const res = await fetch(`http://localhost:5000/api/meetings/${club}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            allMeetings = allMeetings.concat(data);
          }
        }

        setMeetings(allMeetings);
      } catch (error) {
        console.error(error);
        setMessage('Failed to load meetings');
      }
      setLoadingMeetings(false);
    };

    fetchAllMeetings();
  }, [user, token, loading]);

  const sendInvites = async (meetingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/meetings/${meetingId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      // Refresh meetings list after sending invites
      // (Optionally, call fetchAllMeetings here if lifted)
    } catch (err) {
      console.error(err);
    }
  };

  const markAttendance = async (meetingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/meetings/${meetingId}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      // Optionally refresh meetings list after marking attendance
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || loadingMeetings) return <div>Loading meetings...</div>;

  if (!user) return <div>Please login to view meetings.</div>;

  return (
    <div className="meetings-page">
      <div className="meetings-card">
        <h2>Your Club Meetings</h2>
        <div className="meeting-buttons">
          <Link to="/schedule-meeting" className="btn-schedule">Schedule Meeting</Link>
          <Link to="/meetings" className="btn-meeting">Meetings</Link>
        </div>

        {message && <p className="info-msg">{message}</p>}

        {meetings.length === 0 && <p>No meetings found.</p>}

        {meetings.map((meeting) => (
          <div className="meeting-item" key={meeting._id}>
            <h3>{meeting.title}</h3>
            <p><strong>Date:</strong> {new Date(meeting.scheduledAt).toLocaleString()}</p>
            {meeting.agenda && <p><strong>Agenda:</strong> {meeting.agenda}</p>}
            {meeting.location && <p><strong>Location:</strong> {meeting.location}</p>}
            <p><strong>Invites Sent:</strong> {meeting.invitationsSent ? 'Yes' : 'No'}</p>
            <p><strong>Attendees:</strong> {meeting.attendees?.length || 0}</p>

            <div className="meeting-actions">
              {!meeting.invitationsSent && (
                <button className="invite-btn" onClick={() => sendInvites(meeting._id)}>
                  Send Invites
                </button>
              )}
              <button
                className="attend-btn"
                onClick={() => markAttendance(meeting._id)}
              >
                Mark Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeetingsList;
