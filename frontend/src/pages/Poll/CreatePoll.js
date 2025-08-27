import React, { useEffect, useState } from 'react';
import './CreatePoll.css';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Use the same endpoint Navbar uses to fetch only the user's clubs
  // so the dropdown contains clubs the user actually belongs to
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUserClubs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/clubs/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setClubs([]);
          return;
        }
        const data = await res.json();
        setClubs(Array.isArray(data) ? data : []);
        if (data && data.length > 0) {
          setClubId(String(data._id));
        }
      } catch (e) {
        console.error('Fetch user clubs error:', e);
        setClubs([]);
      }
    };

    fetchUserClubs();
  }, []);

  const handleOptionChange = (value, index) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const addOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const cleaned = options.map((o) => (o || '').trim()).filter(Boolean);

    if (!clubId || !question.trim() || cleaned.length < 2) {
      setError('Please provide club, question, and at least two options.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const res = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Send options as strings; server normalizes
        body: JSON.stringify({
          clubId: String(clubId),
          question: question.trim(),
          options: cleaned,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || `Failed to create poll (${res.status})`);
        return;
      }

      setMessage('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
      // Keep clubId as-is for convenience
    } catch (err) {
      console.error('Create poll error:', err);
      setError('Something went wrong: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div className="poll-page">
      <div className="poll-card">
        <h2>Create a Poll</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Club</label>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              required
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

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
                  <button type="button" onClick={() => removeOption(idx)}>
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addOption}>
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
