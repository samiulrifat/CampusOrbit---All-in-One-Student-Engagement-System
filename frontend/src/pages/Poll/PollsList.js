import React, { useState, useEffect } from 'react';
import api from '../../api';
import './PollsList.css';

function PollsList() {
  const [polls, setPolls] = useState([]);
  const [clubId, setClubId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setClubId(user.clubId);
      fetchPolls(user.clubId);
    }
  }, []);

  const fetchPolls = async (clubId) => {
    try {
      const { data } = await api.get(`/polls/${clubId}`);
      setPolls(data);
    } catch (err) {
      console.error('Error fetching polls:', err);
    }
  };

  const vote = async (pollId, optionIndex) => {
    try {
      const { data } = await api.post(`/polls/${pollId}/vote`, { optionIndex });
      setMessage(data.message || data.error);
      fetchPolls(clubId);
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const closePoll = async (pollId) => {
    try {
      const { data } = await api.patch(`/polls/${pollId}/close`);
      setMessage(data.message || data.error);
      fetchPolls(clubId);
    } catch (err) {
      console.error('Error closing poll:', err);
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
                <button
                  className="close-btn"
                  onClick={() => closePoll(poll._id)}
                >
                  Close Poll
                </button>
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
