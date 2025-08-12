import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import './CreatePoll.css';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [clubId, setClubId] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auto-fill IDs from logged-in user (if persisted in localStorage)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setClubId(user.clubId);
      setCreatorId(user.id);
    }
  }, []);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId, creatorId, question, options })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create poll');
        return;
      }
      setMessage('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
    } catch (err) {
      setError('Something went wrong: ' + err.message);
    }
  };

  return (
    <div className="poll-page">
      <div className="poll-card">
        <img src={logo} alt="CampusOrbit Logo" className="poll-logo" />
        <h2>Create a Poll</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter poll question"
              required
            />
          </div>

          <div className="form-group">
            <label>Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="option-row">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  placeholder={`Option ${idx + 1}`}
                  required
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(idx)}>✖</button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-btn" 
              onClick={addOption}
            >
              + Add Option
            </button>
          </div>

          <button type="submit" className="create-btn">Create Poll</button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}

export default CreatePoll;
