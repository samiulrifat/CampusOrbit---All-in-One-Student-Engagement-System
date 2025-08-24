import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-title">CampusOrbit</h2>
        <p className="footer-text">Connecting students, clubs, and events all in one place.</p>

        <ul className="footer-links">
          <li><a href="/about">About</a></li>
          <li><a href="/clubs">Clubs</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        <div className="footer-bottom">
          © {new Date().getFullYear()} CampusOrbit. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
