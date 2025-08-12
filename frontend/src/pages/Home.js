import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

// Import all your pictures here (make sure they exist in assets)
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';
import pic4 from '../assets/pic4.jpg';

import './Home.css';

const images = [pic1, pic2, pic3, pic4];

function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <img src={logo} alt="CampusOrbit Logo" className="home-logo" />
        <h1>Welcome to CampusOrbit</h1>
        <p>Your all-in-one student engagement platform</p>
      </header>

      <div className="home-buttons">
        <Link to="/login">
          <button className="home-btn login-btn">Login</button>
        </Link>
        <Link to="/register">
          <button className="home-btn register-btn">Register</button>
        </Link>
      </div>

      <section className="gallery-section">
        <h2>Explore Our Campus</h2>
        <div className="image-grid">
          {images.map((img, idx) => (
            <div key={idx} className="image-card">
              <img src={img} alt={`Gallery pic ${idx + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
