import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return <p className="unauth-text">You are not logged in.</p>;

  const isAdmin = user.role === 'club_admin';

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1 className="dashboard-welcome">Welcome, {user.name} 👋</h1>
        <p className="dashboard-subtitle">Here’s your CampusOrbit overview</p>

        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.createdAt && (
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          )}
        </div>

        <div className="quick-actions">
          {isAdmin ? (
            <>
              <Link to="/clubs/manage" className="action-card">
                <h3>⚙ Manage Clubs</h3>
                <p>Update profiles, members & invites</p>
              </Link>
              <Link to="/schedule-meeting" className="action-card">
                <h3>📅 Schedule Meeting</h3>
                <p>Plan and organize club meetings</p>
              </Link>
              <Link to="/create-poll" className="action-card">
                <h3>🗳 Create Poll</h3>
                <p>Engage members with quick polls</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/clubs" className="action-card">
                <h3>🏛 My Clubs</h3>
                <p>View and join campus clubs</p>
              </Link>
              <Link to="/events" className="action-card">
                <h3>🎉 Events</h3>
                <p>Explore upcoming campus events</p>
              </Link>
              <Link to="/polls" className="action-card">
                <h3>🗳 Polls</h3>
                <p>Vote and share your opinion</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
