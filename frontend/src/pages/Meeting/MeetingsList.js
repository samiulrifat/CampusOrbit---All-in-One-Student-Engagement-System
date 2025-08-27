import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useClub } from '../../context/ClubProvider';
import './MeetingsList.css';

function MeetingsList() {
  const { user, loading: authLoading, token } = useAuth();
  const { selectedClubId } = useClub();
  const { clubId: clubIdParam } = useParams();
  const navigate = useNavigate();

  const clubId = useMemo(() => clubIdParam || selectedClubId || null, [clubIdParam, selectedClubId]);

  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [message, setMessage] = useState('');

  // If only context has a club, push URL to match navbar links
  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) return;
    if (!clubIdParam && selectedClubId) {
      navigate(`/clubs/meetings/${selectedClubId}`, { replace: true });
    }
  }, [authLoading, user, token, clubIdParam, selectedClubId, navigate]);

  // Fetch meetings for the active club
  useEffect(() => {
    if (authLoading) return;
    if (!user || !token || !clubId) return;

    const fetchMeetings = async () => {
      setLoadingMeetings(true);
      try {
        const res = await fetch(`http://localhost:5000/api/meetings/${clubId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMessage(err?.error || `Failed to load meetings (${res.status})`);
          setMeetings([]);
        } else {
          const data = await res.json();
          setMeetings(Array.isArray(data) ? data : []);
          setMessage('');
        }
      } catch (e) {
        console.error('Fetch meetings error:', e);
        setMessage('Failed to load meetings');
      } finally {
        setLoadingMeetings(false);
      }
    };

    fetchMeetings();
  }, [authLoading, user, token, clubId]);

  const sendInvites = async (meetingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/meetings/${meetingId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      // optionally refetch meetings
    } catch (err) {
      console.error(err);
    }
  };

  const markAttendance = async (meetingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/meetings/${meetingId}/attend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user?._id }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      // optionally refetch meetings
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loadingMeetings) return <div>Loading meetings...</div>;
  if (!user) return <div>Please login to view meetings.</div>;
  if (!clubId) return <div>Select a club from the navbar to view meetings.</div>;

  const isAdmin = user?.role === 'club_admin';

  return (
    <div className="meetings-page">
      <div className="meetings-card">
        <h2>Your Club Meetings</h2>
        <div className="meeting-buttons">
          {isAdmin && <Link to="/schedule-meeting" className="btn-schedule">Schedule Meeting</Link>}
          <Link to={`/clubs/meetings/${clubId}`} className="btn-meeting">Refresh</Link>
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
              {isAdmin && !meeting.invitationsSent && (
                <button className="invite-btn" onClick={() => sendInvites(meeting._id)}>
                  Send Invites
                </button>
              )}
              <button className="attend-btn" onClick={() => markAttendance(meeting._id)}>
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
