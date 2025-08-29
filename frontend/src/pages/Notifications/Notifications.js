import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        setError("Failed to fetch notifications.");
      }
    };
    fetchNotifications();
  }, [token]);

  return (
    <div className="notifications-page">
      <div className="notifications-card">
        <h1>Notifications</h1>
        {error && <p className="error">{error}</p>}
        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notif, idx) => (
              <li key={notif._id || idx} className="notification-item">
                <span className="notification-type">{notif.type}</span>
                <h3 className="notification-title">{notif.title}</h3>
                <p className="notification-message">{notif.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
