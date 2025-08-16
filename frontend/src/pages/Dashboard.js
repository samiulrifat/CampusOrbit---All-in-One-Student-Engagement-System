// frontend/src/pages/Dashboard.js

import React from "react";
import EventManager from "../components/Events/EventManager";
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>CampusOrbit Dashboard</h1>
      {/* Event Management Section */}
      <section className="dashboard-events">
        <h2>Event Management</h2>
        <p>
          Create, edit, and manage upcoming events.
        </p>
        <EventManager />
      </section>
    </div>
  );
};

export default Dashboard;
