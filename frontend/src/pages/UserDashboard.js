import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import './UserDashboard.css';

function UserDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return <p className="unauth-text">You are not logged in.</p>;

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1 className="dashboard-welcome">Welcome, {user.name}!</h1>

        {user.role === 'club_admin' ? (
          <div className="dashboard-section admin-view">
            <h2>Admin Dashboard</h2>
            <p>You have full access including creating events, polls, and scheduling meetings.</p>
            <button
              className="btn-club-dashboard"
              onClick={() => navigate('/club-dashboard')}
            >
              Go to Club Dashboard
            </button>
          </div>
        ) : (
          <div className="dashboard-section student-view">
            <h2>Student Dashboard</h2>
            <p>You can view club resources, attend events, and participate in polls.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDashboard;
