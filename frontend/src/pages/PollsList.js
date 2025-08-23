import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthProvider';
import './PollsList.css';

function PollsList() {
  const [polls, setPolls] = useState([]);
  const [clubId, setClubId] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setClubId(user.clubId);
      fetchPolls(user.clubId);
    }
  }, [user]);

  const fetchPolls = async (clubId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${clubId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setPolls(data);
    } catch (err) {
      console.error(err);
    }
  };

  const vote = async (pollId, optionIndex) => {
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ optionIndex })
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchPolls(clubId);
    } catch (err) {
      console.error(err);
    }
  };

  const closePoll = async (pollId) => {
    if (user.role !== 'clubAdmin') {
      setMessage('Only club admins can close polls');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}/close`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchPolls(clubId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="polls-page">
      <div className="polls-card">
        <img src={logo} alt="CampusOrbit Logo" className="polls-logo" />
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
                    {opt.text} — {opt.votes} votes
                    {poll.isOpen && (
                      <button
                        className="vote-btn"
                        onClick={() => vote(poll._id, idx)}
                      >
                        Vote
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {poll.isOpen ? (
                user.role === 'clubAdmin' && (
                  <button className="close-btn" onClick={() => closePoll(poll._id)}>Close Poll</button>
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
