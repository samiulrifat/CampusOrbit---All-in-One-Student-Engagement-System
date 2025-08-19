import React, { useState } from 'react';
import api from '../api';

const SponsorshipRequestForm = ({ eventId }) => {
  const [companyName, setCompanyName] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await api.post(`/api/sponsorships/${eventId}`, {
        companyName,
        amount: Number(amount),
        details
      });
      setStatus('Submitted!');
      setCompanyName(''); setAmount(''); setDetails('');
    } catch (e) {
      console.error('sponsorship submit failed', e);
      setStatus('Submission failed');
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Request Sponsorship</h3>
      <label>Company/Organization</label>
      <input value={companyName} onChange={e => setCompanyName(e.target.value)} required />
      <label>Amount (BDT)</label>
      <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
      <label>Details</label>
      <textarea rows={4} value={details} onChange={e => setDetails(e.target.value)} />
      <button className="btn btn-primary" type="submit">Submit</button>
      {status && <p className="hint">{status}</p>}
    </form>
  );
};

export default SponsorshipRequestForm;
