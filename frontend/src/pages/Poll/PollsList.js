import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useClub } from '../../context/ClubProvider';
import './PollsList.css';

function PollsList() {
  const { user, loading: authLoading, token } = useAuth();
  const { selectedClubId } = useClub();
  const { clubId: clubIdParam } = useParams();
  const navigate = useNavigate();

  const clubId = useMemo(() => clubIdParam || selectedClubId || null, [clubIdParam, selectedClubId]);

  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(false);
  const [message, setMessage] = useState('');

  // If only context has a club, push URL to match navbar links
  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) return;
    if (!clubIdParam && selectedClubId) {
      navigate(`/clubs/polls/${selectedClubId}`, { replace: true });
    }
  }, [authLoading, user, token, clubIdParam, selectedClubId, navigate]);

  // Fetch polls for the active club
  useEffect(() => {
    if (authLoading) return;
    if (!user || !token || !clubId) return;

    const fetchPolls = async () => {
      setLoadingPolls(true);
      try {
        const res = await fetch(`http://localhost:5000/api/polls/${clubId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMessage(err?.error || `Failed to load polls (${res.status})`);
          setPolls([]);
        } else {
          const data = await res.json();
          setPolls(Array.isArray(data) ? data : []);
          setMessage('');
        }
      } catch (e) {
        console.error('Fetch polls error:', e);
        setMessage('Failed to load polls');
      } finally {
        setLoadingPolls(false);
      }
    };

    fetchPolls();
  }, [authLoading, user, token, clubId]);

  const vote = async (pollId, optionIndex) => {
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ optionIndex }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);

      // Refetch to reflect new votes on success
      if (res.ok) {
        const refresh = await fetch(`http://localhost:5000/api/polls/${clubId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const next = await refresh.json();
        setPolls(Array.isArray(next) ? next : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closePoll = async (pollId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || data.error);

      // Refetch to reflect closure
      const refresh = await fetch(`http://localhost:5000/api/polls/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const next = await refresh.json();
      setPolls(Array.isArray(next) ? next : []);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loadingPolls) return <div>Loading polls...</div>;
  if (!user) return <div>Please login to view polls.</div>;
  if (!clubId) return <div>Select a club from the navbar to view polls.</div>;

  const isAdmin = user?.role === 'club_admin';

  return (
    <div className="polls-page">
      <div className="polls-card">
        <h2>Club Polls</h2>
        {message && <p className="info-msg">{message}</p>}
        {polls.length === 0 ? (
          <p>No polls available.</p>
        ) : (
          polls.map((poll) => (
            <div key={poll._id} className="poll-item">
              <h3>{poll.question}</h3>
              <ul>
                {poll.options?.map((opt, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <span>{opt.text} — {opt.votes} votes</span>
                    {poll.isOpen && (
                      <button
                        className="vote-btn"
                        style={{ marginLeft: 12 }}
                        onClick={() => vote(poll._id, idx)}
                      >
                        Vote
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {poll.isOpen ? (
                isAdmin ? (
                  <button className="close-btn" onClick={() => closePoll(poll._id)}>Close Poll</button>
                ) : (
                  <p className="open-msg">Poll Open</p>
                )
              ) : (
                <p className="closed-msg">Poll Closed</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PollsList;
