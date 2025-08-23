import React from 'react';
import { Link } from 'react-router-dom';
import './OfficerNav.css';
import useAuth from '../hooks/useAuth';

function OfficerNav() {
  const { user } = useAuth();

  // Only show if logged in and user is a club admin
  if (!user || user.role !== 'clubAdmin') return null;

  return (
    <nav className="officer-nav">
      <Link to="/schedule-meeting" className="nav-btn">Schedule Meeting</Link>
      <Link to="/meetings" className="nav-btn">View Meetings</Link>
      {/* Add more club admin links as needed */}
    </nav>
  );
}

export default OfficerNav;
