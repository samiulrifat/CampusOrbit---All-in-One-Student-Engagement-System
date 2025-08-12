import React from "react";
import logo from '../assets/logo.png';
import EventManager from "../components/Events/EventManager";
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      {/* Example heading */}
      <h1 style={{ color: "#333", marginBottom: "20px" }}>CampusOrbit Dashboard</h1>

      {/* Render our new Event Manager section */}
      <section
        style={{
          background: "#f0f4f8",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#4CAF50" }}>Event Management</h2>
        <p style={{ marginBottom: "15px", fontSize: "16px", color: "#555" }}>
          Create, edit, and manage upcoming events.
        </p>
        <EventManager />
      </section>
    </div>
  );
};

export default Dashboard;
