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
            <ul>
              {selectedClub.members.map((member) => (
                <li key={member._id}>
                  <strong>{member.name || 'Unknown'}</strong> ({member.email}) — <em>{member.role}</em> (joined{" "}
                  {new Date(member.joinedAt).toLocaleString()})
                </li>
              ))}
            </ul>
          ) : (
            <p>No members found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Members;