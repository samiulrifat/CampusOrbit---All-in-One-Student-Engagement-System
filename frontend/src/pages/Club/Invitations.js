import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import './Invitations.css';

const Invitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const token = localStorage.getItem('token');

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clubs/invitations/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvitations(res.data);
    } catch (err) {
      console.error('Error fetching invitations:', err.response?.data || err);
    }
  }, [token]); // dependency on token

  const acceptInvitation = async (invitationId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/clubs/invitations/${invitationId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInvitations(); // refresh list
    } catch (err) {
      console.error('Error accepting invitation:', err.response?.data || err);
    }
  };

  useEffect(() => {
    if (user) fetchInvitations();
  }, [user, fetchInvitations]);

  if (!user) return <p>Please login to view invitations.</p>;

  return (
    <div className="invitations-page">
      <h1>Club Invitations</h1>
      {invitations.length === 0 ? (
        <p>No pending invitations</p>
      ) : (
        <ul className="invitations-list">
          {invitations.map(inv => (
            <li key={inv.invitationId}>
              <span>{inv.clubName} (Invited on: {new Date(inv.invitedAt).toLocaleDateString()})</span>
              <button onClick={() => acceptInvitation(inv.invitationId)}>Accept</button>
            </li>

          ))}
        </ul>
      )}
    </div>
  );
};

export default Invitations;