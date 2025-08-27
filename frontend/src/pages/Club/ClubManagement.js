import React, { useState, useEffect } from "react";
import { getClubs, createClub, inviteToClub, removeFromClub, deleteClub } from "../../api";
import "./ClubManagement.css";

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");

  // Fetch clubs when component loads
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setClubs(await getClubs());
    } catch (err) {
      console.error("Error fetching clubs:", err.response?.data || err);
    }
  };

  // Create club
  const handleCreateClub = async () => {
    if (!newClubName.trim()) return;
    try {
        const created = await createClub({ name: newClubName });
        setClubs([...clubs, created.club ?? created]);
      setNewClubName("");
    } catch (err) {
      console.error("Error creating club:", err.response?.data || err);
    }
  };

  // Add member directly (no invitation)
  const handleAddMember = async () => {
    if (!inviteEmail.trim() || !selectedClub) return;
    try {
      const result = await inviteToClub(selectedClub._id, { email: inviteEmail });
      const updated = result.club ?? result;
      setSelectedClub(updated);
      setClubs(clubs.map(c => c._id === updated._id ? updated : c));
      setInviteEmail("");
    } catch (err) {
      console.error("Error adding member:", err.response?.data || err);
    }
  };

  // Remove member
  const handleRemoveMember = async (userId) => {
    try {
      const result = await removeFromClub(selectedClub._id, userId);
      const updated = result.club ?? result;
      setSelectedClub(updated);
      setClubs(clubs.map(c => c._id === updated._id ? updated : c));
    } catch (err) {
      console.error("Error removing member:", err.response?.data || err);
    }
  };

  // Delete club
  const handleDeleteClub = async (clubId) => {
    try {
      await deleteClub(clubId);
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
      <div className="glass-card">
        <h2>Create New Club</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="Club name"
            value={newClubName}
            onChange={(e) => setNewClubName(e.target.value)}
          />
          <button onClick={handleCreateClub} className="btn-primary">Create</button>
        </div>
      </div>

      {/* List of Clubs */}
      <div className="glass-card">
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
              <button className="btn-danger" onClick={() => handleDeleteClub(club._id)}>✖</button>
            </div>
          ))
        )}
      </div>

      {/* Management Panel */}
      {selectedClub && (
        <div className="glass-card">
          <h2>Manage "{selectedClub.name}"</h2>

          {/* Add Member */}
          <div className="invite-member">
            <input
              type="email"
              placeholder="Add member by email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button onClick={handleAddMember} className="btn-success">Add</button>
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
                  <button className="btn-danger" onClick={() => handleRemoveMember(m.userId?._id)}>Remove</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubManagement;