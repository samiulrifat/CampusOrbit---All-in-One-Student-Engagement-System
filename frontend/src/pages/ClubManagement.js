import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ClubManagement.css";

export default function ClubManagement() {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const API_URL = "http://localhost:5000/api/clubs";
  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch clubs when component loads
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await axios.get(API_URL);
      setClubs(res.data);
    } catch (err) {
      console.error("Error fetching clubs:", err.response?.data || err);
    }
  };

  // Create club (requires login)
  const handleCreateClub = async () => {
    if (!newClubName.trim()) return;
    try {
      const res = await axios.post(
        API_URL,
        { name: newClubName },
        authHeaders
      );
      setClubs([...clubs, res.data.club]);
      setNewClubName("");
    } catch (err) {
      console.error("Error creating club:", err.response?.data || err);
    }
  };

  // Invite member (officer/admin)
  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !selectedClub) return;
    try {
      const res = await axios.post(
        `${API_URL}/${selectedClub._id}/invite`,
        { email: inviteEmail },
        authHeaders
      );
      setSelectedClub(res.data.club);
      setClubs(clubs.map(c => c._id === res.data.club._id ? res.data.club : c));
      setInviteEmail("");
    } catch (err) {
      console.error("Error inviting member:", err.response?.data || err);
    }
  };

  // Remove member (officer/admin)
  const handleRemoveMember = async (userId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/${selectedClub._id}/remove`,
        { ...authHeaders, data: { userId } }
      );
      setSelectedClub(res.data.club);
      setClubs(clubs.map(c => c._id === res.data.club._id ? res.data.club : c));
    } catch (err) {
      console.error("Error removing member:", err.response?.data || err);
    }
  };

  // Delete club (officer/admin)
  const handleDeleteClub = async (clubId) => {
    try {
      await axios.delete(`${API_URL}/${clubId}`, authHeaders);
      setClubs(clubs.filter(c => c._id !== clubId));
      if (selectedClub?._id === clubId) setSelectedClub(null);
    } catch (err) {
      console.error("Error deleting club:", err.response?.data || err);
    }
  };

  return (
    <div className="club-management-page">
      <h1>Club Management</h1>

      {/* Create Club */}
      <div className="club-create-form">
        <h2>Create New Club</h2>
        <input
          type="text"
          placeholder="Club name"
          value={newClubName}
          onChange={(e) => setNewClubName(e.target.value)}
        />
        <button onClick={handleCreateClub}>Create</button>
      </div>

      {/* List of Clubs */}
      <div className="club-list">
        <h2>Your Clubs</h2>
        {clubs.length === 0 ? (
          <p>No clubs found.</p>
        ) : (
          clubs.map((club) => (
            <div
              key={club._id}
              className={`club-item ${selectedClub?._id === club._id ? "selected" : ""}`}
            >
              <span onClick={() => setSelectedClub(club)}>{club.name}</span>
              <button className="delete-club-btn" onClick={() => handleDeleteClub(club._id)}>✖</button>
            </div>
          ))
        )}
      </div>

      {/* Management Panel */}
      {selectedClub && (
        <div className="club-details">
          <h2>Manage "{selectedClub.name}"</h2>

          {/* Invite Section */}
          <div className="invite-member">
            <input
              type="email"
              placeholder="Invite member by email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button onClick={handleInviteMember}>Invite</button>
          </div>

          {/* Members Section */}
          <div className="club-members">
            <h3>Members</h3>
            {selectedClub.members.length === 0 ? (
              <p>No members yet.</p>
            ) : (
              selectedClub.members.map((m, i) => (
                <div key={i} className="member-item">
                  <span>
                    {m.userId?.name} ({m.userId?.email}) - {m.role}
                  </span>
                  <button onClick={() => handleRemoveMember(m.userId?._id)}>Remove</button>
                </div>
              ))
            )}
          </div>

          {/* Invitations Section */}
          <div className="club-invitations">
            <h3>Pending Invitations</h3>
            {selectedClub.invitations?.length === 0 ? (
              <p>No pending invitations.</p>
            ) : (
              selectedClub.invitations.map((inv, i) => (
                <div key={i} className="invitation-item">
                  <span>{inv.email}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
