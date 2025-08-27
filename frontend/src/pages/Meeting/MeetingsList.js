import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import api from '../../api';
import './MeetingsList.css';

function MeetingsList() {
  const { user, loading } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    const fetchAllMeetings = async () => {
      setLoadingMeetings(true);
      try {
        let allMeetings = [];

        for (const club of user.clubsJoined || []) {
          const { data } = await api.get(`/meetings/${club}`);
          allMeetings = allMeetings.concat(data);
        }

        setMeetings(allMeetings);
      } catch (error) {
        console.error(error);
        setMessage('Failed to load meetings');
      } finally {
        setLoadingMeetings(false);
      }
    };

    fetchAllMeetings();
  }, [user, loading]);

  const sendInvites = async (meetingId) => {
    try {
      const { data } = await api.post(`/meetings/${meetingId}/invite`);
      setMessage(data.message || data.error);
      // Optionally refresh meetings here
    } catch (err) {
      console.error(err);
    }
  };

  const markAttendance = async (meetingId) => {
    try {
      const { data } = await api.post(`/meetings/${meetingId}/attend`, {
        userId: user._id,
      });
      setMessage(data.message || data.error);
      // Optionally refresh meetings here
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
