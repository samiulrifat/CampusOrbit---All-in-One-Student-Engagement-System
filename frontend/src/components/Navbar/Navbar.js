import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, loading } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/clubs/user";

  // Fetch user clubs
  useEffect(() => {
    if (!user || !token) return;
    const fetchClubs = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(res.data);
        if (res.data.length > 0) setSelectedClub(res.data[0]);
      } catch (err) {
        console.error("Error fetching clubs:", err.response?.data || err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };
    fetchClubs();
  }, [user, token, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (loading) return null;

  const isAdmin = user?.role === "club_admin";
  const clubId = selectedClub?._id || (clubs.length > 0 ? clubs[0]._id : null);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img
            src={logo}
            alt="CampusOrbit Logo"
            className="app-logo"
            onClick={() => navigate("/dashboard")}
          />
          <Link to="/" className="navbar-logo">
            CampusOrbit
          </Link>
        </div>

        <button className="navbar-toggle" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-links ${isOpen ? "open" : ""}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          {user ? (
            <>
              {isAdmin ? (
                <>
                  <Link
                    to="/events"
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    to="/clubs/manage"
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Clubs
                  </Link>
                  <Link
                    to="/meetings"
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Meetings
                  </Link>
                  <Link
                    to={`/create-poll`}
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Poll
                  </Link>
                  <Link
                    to="/invitations"
                    className="navbar-link"
                  >
                    Members
                  </Link>
                  <Link
                    to={`/clubs/resources/upload/${clubId}`}
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Resources
                  </Link>
                  <Link
                    to={`/clubs/achievements/${clubId}`}
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Achievements
                  </Link>
                  <Link
                    to='/clubs/announcements' //since Announcements.js doesn't even take clubId from params, it is useless
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Announcements
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={`/clubs/resources/${clubId}`}
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Resources
                  </Link>
                  <Link
                    to={`/clubs/workspace/${clubId}`}
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    ClubWorkspace
                  </Link>
                  <Link
                    to={`/clubs/achievements/${clubId}`}
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Achievements
                  </Link>
                  <Link
                    to='/clubs/announcements'
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Announcements
                  </Link>
                  <Link
                    to='/notifications'
                    className="navbar-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Notifications
                  </Link>
                </>
              )}

              <Link to="/dashboard">
                <span className="navbar-user-badge">{user.name}</span>
              </Link>
              <button className="navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-tartiary" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
