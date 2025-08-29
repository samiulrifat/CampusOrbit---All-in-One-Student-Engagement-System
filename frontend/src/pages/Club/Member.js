import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Member.css";

const CLUBS_API = "http://localhost:5000/api/clubs/user";

const Members = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Fetch user clubs
  useEffect(() => {
    if (!token) {
      setError("Please log in to view clubs.");
      return;
    }
    const fetchClubs = async () => {
      try {
        const res = await axios.get(CLUBS_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(res.data);
        if (res.data.length > 0) setSelectedClub(res.data[0]);
        setError("");
      } catch (err) {
        console.error("Error fetching clubs:", err.response?.data || err);
        setError(err.response?.data?.error || "Failed to fetch clubs.");
      }
    };
    fetchClubs();
  }, [token]);

  const handleSelectClub = (club) => setSelectedClub(club);

  const updateMemberRole = (clubId, memberId, role) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to update member roles.");
      return;
    }
    console.log(memberId);
    const updateRole = async () => {
      try {
        await axios.post('http://localhost:5000/api/clubs/user', {
          userId: memberId,
          role: role,
          clubId: clubId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await axios.post('http://localhost:5000/api/notifications', {
          user: memberId,
          type: "event-update",
          title: "Role Change",
          message: `Your role in the club has been changed to ${role}.`

        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setClubs((prevClubs) =>
          prevClubs.map((club) =>
            club._id === clubId
              ? {
                ...club,
                members: club.members.map((member) =>
                  member.userId === memberId ? { ...member, role: role } : member
                )
              }
              : club
          )
        );
        setSelectedClub((prevSelectedClub) => ({
          ...prevSelectedClub,
          members: prevSelectedClub.members.map((member) =>
            member.userId === memberId ? { ...member, role: role } : member
          )
        }));
        setError("");
      } catch (err) {
        console.error("Error updating member role:", err.response?.data || err);
        setError(err.response?.data?.error || "Failed to update member role.");
      }
    };
    updateRole();
  };

  return (
    <div className="members-page">
      <h1>Club Dashboard</h1>

      {error && (
        <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      {/* Club List */}
      <div className="glass-card">
        <h2>Your Clubs</h2>
        {clubs.length === 0 ? (
          <p>No clubs found.</p>
        ) : (
          clubs.map((club) => (
            <div
              key={club._id}
              className={`club-item ${selectedClub?._id === club._id ? "selected" : ""
                }`}
              onClick={() => handleSelectClub(club)}
            >
              <strong>{club.name}</strong>
            </div>
          ))
        )}
      </div>

      {/* Club Details */}
      {selectedClub && (
        <div className="glass-card club-details">
          <h2>Club Details</h2>

          {selectedClub.profileImage && (
            <img
              src={selectedClub.profileImage}
              alt={selectedClub.name}
              className="club-profile-img"
            />
          )}

          <p><strong>Name:</strong> {selectedClub.name}</p>
          <p><strong>Description:</strong> {selectedClub.description || "No description"}</p>
          <p><strong>Club ID:</strong> {selectedClub._id}</p>
          <p><strong>Creator ID:</strong> {selectedClub.creatorId}</p>
          <p><strong>Created At:</strong> {new Date(selectedClub.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(selectedClub.updatedAt).toLocaleString()}</p>

          <h3>Members</h3>
          {selectedClub.members && selectedClub.members.length > 0 ? (
            <table className="members-table glass-card">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {selectedClub.members.map((member) => (
                  <tr key={member._id || member.userId || member.email}>
                    <td>{member.name || 'Unknown'}</td>
                    <td>{member.email}</td>
                    <td>
                      <select
                        value={member.role}
                        onChange={e => {
                          updateMemberRole(selectedClub._id, member.userId, e.target.value);
                        }}
                        className="role-dropdown"
                      >
                        <option value="member">Member</option>
                        <option value="officer">Officer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(member.joinedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No members found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Members;