import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './UserDashboard.css';

function ClubDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1>Club Dashboard</h1>

        <button
          className="btn-manage-events"
          onClick={() => navigate('events')}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Manage Events
        </button>

        <button
          className="btn-create-poll"
          onClick={() => navigate('/create-poll')}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#0059cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          + Create Poll
        </button>

        {/* Renders nested routes here */}
        <Outlet />
      </div>
    </>
  );
}

export default ClubDashboard;
