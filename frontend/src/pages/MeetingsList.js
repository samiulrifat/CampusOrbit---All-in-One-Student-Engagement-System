import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import './MeetingsList.css';
import OfficerNav from '../components/OfficerNav';

function MeetingsList() {
  const [meetings, setMeetings] = useState([]);
  const [clubId, setClubId] = useState(''); // In a real app, get this from logged-in user's club
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch meetings from backend
  const fetchMeetings = async () => {
    if (!clubId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/meetings/${clubId}`);
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Send invites
  const sendInvites = async (meetingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/meetings/${meetingId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchMeetings(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // Mark attendance (example: hard-coded for now)
  const markAttendance = async (meetingId, userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/meetings/${meetingId}/attend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchMeetings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="meetings-page">
      <div className="meetings-card">
        <img src={logo} alt="CampusOrbit Logo" className="meetings-logo" />
        <OfficerNav />
        <h2>Club Meetings</h2>

        {/* Club ID input for testing */}
        <div className="club-input">
          <input
            type="text"
            placeholder="Enter Club ID and press Fetch"
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
          />
          <button onClick={fetchMeetings}>Fetch Meetings</button>
        </div>

        {loading && <p>Loading...</p>}
        {message && <p className="info-msg">{message}</p>}

        <div>
          {meetings.length === 0 && !loading && <p>No meetings found.</p>}
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
                  onClick={() => markAttendance(meeting._id, 'USER_ID_HERE')}
                >
                  Mark Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MeetingsList;
