import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { createPoll as apiCreatePoll } from '../../api/clubApi';
import './CreatePoll.css';

export default function CreatePoll() {
  const { user, token } = useAuth();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const t = token || localStorage.getItem('token');
        if (!t) return;
        const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}/api/clubs/user`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) {
          const data = await res.json();
          setClubs(data || []);
        }
      } catch (err) {
        console.error(err);
        setClubs([]);
      }
    };
    fetchClubs();
  }, [token]);

  const updateOption = (idx, value) => {
    const copy = [...options];
    copy[idx] = value;
    setOptions(copy);
  };

  const addOption = () => setOptions(prev => [...prev, '']);
  const removeOption = (idx) => setOptions(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const t = token || localStorage.getItem('token');
    if (!t || !user) return setError('Invalid user, please login');

    const cleanedOptions = options.map(o => (o || '').trim()).filter(Boolean);
    if (!clubId) return setError('Select a club');
    if (!question.trim()) return setError('Question required');
    if (cleanedOptions.length < 2) return setError('Provide at least two options');

    try {
      const payload = { question: question.trim(), options: cleanedOptions };
      await apiCreatePoll(clubId, payload, t);
      setMessage('Poll created successfully');
      setQuestion('');
      setOptions(['', '']);
      setClubId('');
    } catch (err) {
      console.error('create poll error', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed creating poll');
    }
  };

  return (
    <div className="create-poll-card">
      <h2 className="create-poll-title">Create Poll</h2>

      {error && <div className="create-poll-error">{error}</div>}
      {message && <div className="create-poll-success">{message}</div>}

      <form className="create-poll-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label-text">Club</span>
          <select value={clubId} onChange={e => setClubId(e.target.value)} className="select">
            <option value="">Select club</option>
            {clubs.map(c => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name || c.title || c.clubName}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="label-text">Question</span>
          <input className="input" value={question} onChange={e => setQuestion(e.target.value)} />
        </label>

        <div className="field">
          <span className="label-text">Options</span>
          <div className="options-list">
            {options.map((opt, idx) => (
              <div key={idx} className="option-row">
                <input
                  className="input option-input"
                  value={opt}
                  onChange={e => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                />
                {options.length > 2 && (
                  <button type="button" className="btn btn-remove" onClick={() => removeOption(idx)}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-add" onClick={addOption}>Add option</button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-submit">Create Poll</button>
        </div>
      </form>
    </div>
  );
}
