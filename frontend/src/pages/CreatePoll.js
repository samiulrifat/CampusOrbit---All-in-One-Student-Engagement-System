import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthProvider';
import './CreatePoll.css';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !user.role || user.role !== 'club_admin') {
      setError('Access denied: only club admins can create polls.');
      return;
    }
    // Fetch all clubs for club selection dropdown
    // Fetch all clubs for club selection dropdown
    fetch('http://localhost:5000/api/clubs')
     .then(res => res.json())
     .then(data => {
    // Filter clubs where creatorId matches current user _id
       const filteredClubs = data.filter(club => club.creatorId === user._id);
       setClubs(filteredClubs);
     })
     .catch(() => setClubs([]));
  }, [user]);
  

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

    if (!user || user.role !== 'club_admin') {
      setError('Access denied.');
      return;
    }

    // Basic client-side validation
    if (!clubId || !question.trim() || options.filter(opt => opt.trim()).length < 2) {
      setError('Please provide club, question, and at least two options.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Assuming JWT token stored here for auth

      const res = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clubId,
          question,
          options: options.map(opt => ({ text: opt })) // Options as objects with text keys
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create poll');
        return;
      }

      setMessage('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
      setClubId('');
    } catch (err) {
      setError('Something went wrong: ' + err.message);
    }
  };

  if (!user || user.role !== 'club_admin') {
    return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Access denied: only club admins can create polls.</p>;
  }

  return (
    <div className="poll-page">
      <div className="poll-card">
        <img src={logo} alt="CampusOrbit Logo" className="poll-logo" />
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
