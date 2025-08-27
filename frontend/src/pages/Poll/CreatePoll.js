import React, { useState, useEffect } from 'react';
import api from '../../api'; 
import './CreatePoll.css';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all clubs for club selection dropdown
    api.get('/clubs')
      .then(res => setClubs(res.data))
      .catch(() => setClubs([]));
  }, []);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Basic client-side validation
    if (!clubId || !question.trim() || options.filter(opt => opt.trim()).length < 2) {
      setError('Please provide club, question, and at least two options.');
      return;
    }

    try {
      await api.post('/polls', {
        clubId,
        question,
        options: options.map(opt => ({ text: opt })),
      });

      setMessage('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
      setClubId('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create poll');
    }
  };

  return (
    <div className="poll-page">
      <div className="poll-card">
        <h2>Create a Poll</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Club</label>
            <select value={clubId} onChange={e => setClubId(e.target.value)} required>
              <option value="">Select a club</option>
              {clubs.map(club => (
                <option key={club._id} value={club._id}>{club.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
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
                  onChange={e => handleOptionChange(e.target.value, idx)}
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
