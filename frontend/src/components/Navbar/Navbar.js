import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    const isAdmin = user?.role === 'club_admin';

    return (
        <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-brand">
                <img src={logo} alt="CampusOrbit Logo" className="app-logo" onClick={() => navigate("/dashboard")}/>
                <Link to="/" className="navbar-logo">CampusOrbit</Link>
            </div>

            <button className="navbar-toggle" onClick={() => setIsOpen((prev) => !prev)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`navbar-links ${isOpen ? "open" : ""}`}>
            <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>Home</Link>

            {user ? (
                <>
                {isAdmin ? (
                    <>
                    <Link to="/events" className="navbar-link" onClick={() => setIsOpen(false)}>Events</Link>
                    <Link to="/clubs/manage" className="navbar-link" onClick={() => setIsOpen(false)}>Clubs</Link>
                    <Link to="/meetings" className="navbar-link" onClick={() => setIsOpen(false)}>Meetings</Link>
                    <Link to="/create-poll" className="navbar-link" onClick={() => setIsOpen(false)}>Create Poll</Link>
                    <Link to="/clubs/achievements/:clubId" className="navbar-link" onClick={() => setIsOpen(false)}>Achievements</Link>
                    <Link to="/clubs/announcements/:clubId" className="navbar-link" onClick={() => setIsOpen(false)}>Announcements</Link>
                    </>
                ) : (
                    <>
                    <Link to="/events/:id" className="navbar-link" onClick={() => setIsOpen(false)}>Event</Link>
                    <Link to="/calender" className="navbar-link" onClick={() => setIsOpen(false)}>EventCalendar</Link>
                    <Link to="/polls" className="navbar-link" onClick={() => setIsOpen(false)}>PollsList</Link>
                    <Link to="/clubs/workspace/:clubId" className="navbar-link" onClick={() => setIsOpen(false)}>ClubWorkspace</Link>
                    <Link to="/clubs/achievements/:clubId" className="navbar-link" onClick={() => setIsOpen(false)}>Achievements</Link>
                    <Link to="/clubs/announcements/:clubId" className="navbar-link" onClick={() => setIsOpen(false)}>Announcements</Link>
                    </>
                )}
                <Link to="/dashboard"><span className="navbar-user-badge">{user.name}</span></Link>
                <button className="navbar-logout" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                <Link to="/login" className="btn-secondary" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="btn-tartiary" onClick={() => setIsOpen(false)}>Register</Link>
                </>
            )}
            </div>
        </div>
        </nav>
    );
};

export default Navbar;
