import React from 'react';
import { Link } from 'react-router-dom';
import './OfficerNav.css';

function OfficerNav() {
  return (
    <nav className="officer-nav">
      <Link to="/schedule-meeting" className="nav-btn">Schedule Meeting</Link>
      <Link to="/meetings" className="nav-btn">View Meetings</Link>
    </nav>
  );
}

export default OfficerNav;
