import React, { useState, useEffect } from 'react';
import './PollsList.css';
import { fetchPolls as apiFetchPolls, votePoll as apiVotePoll } from '../../api/clubApi';

function PollsList() {
  const [polls, setPolls] = useState([]);
  const [clubId, setClubId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    if (user && token) {
      const id = user.clubId || (user.clubsJoined && user.clubsJoined[0]);
      if (id) {
        setClubId(id);
        apiFetchPolls(id, token).then(r => setPolls(r.data || [])).catch(() => setPolls([]));
      }
    }
  }, []);
 
  const vote = async (pollId, optionIndex) => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiVotePoll(pollId, { optionIndex }, token);
      setMessage(res.data.message || 'Voted');
      // refresh
      const userToken = localStorage.getItem('token');
      apiFetchPolls(clubId, userToken).then(r => setPolls(r.data || [])).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };
 
  const closePoll = async (pollId) => {
    try {
      // if your backend supports closing polls, call here. Otherwise show message.
      setMessage('Close poll not implemented on server.');
    } catch (err) {
      console.error(err);
    }
  };
 
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
                {poll.options.map((opt, idx) => (
                  <li key={idx}>
                    {opt.text} — {(opt.votes || []).length} votes
                    {(!poll.expiresAt || new Date(poll.expiresAt) > new Date()) && (
                      <button className="vote-btn" onClick={() => vote(poll._id, idx)}>Vote</button>
                    )}
                  </li>
                ))}
              </ul>
              {(!poll.expiresAt || new Date(poll.expiresAt) > new Date()) ? (
                <p className="open-msg">Open</p>
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
