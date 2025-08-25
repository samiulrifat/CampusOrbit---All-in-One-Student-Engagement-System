import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminSponsorshipReview = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get('/api/sponsorships?status=pending'); // backend enforces admin
      setItems(res.data || []);
    } catch (e) {
      console.error('load sponsorships failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const decide = async (id, decision) => {
    try {
      await api.patch(`/api/sponsorships/${id}/decision`, { decision });
      load();
    } catch (e) {
      console.error('decision failed', e);
    }
  };

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="card">
      <h3>Pending Sponsorship Requests</h3>
      <div className="table">
        <div className="row head">
          <div>Event</div><div>Company</div><div>Amount</div><div>Organizer</div><div>Actions</div>
        </div>
        {items.length === 0 && <div className="row"><div className="empty">No pending requests</div></div>}
        {items.map(r => (
          <div key={r._id} className="row">
            <div>{r.event?.title}</div>
            <div>{r.companyName}</div>
            <div>${r.amount}</div>
            <div>{r.organizer?.name || r.organizer?.email}</div>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => decide(r._id, 'approved')}>Approve</button>
              <button className="btn btn-danger ml-2" onClick={() => decide(r._id, 'rejected')}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSponsorshipReview;
