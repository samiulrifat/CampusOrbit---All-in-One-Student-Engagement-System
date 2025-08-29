import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import pic1 from '../../assets/pic1.jpg';
import pic2 from '../../assets/pic2.jpg';
import pic3 from '../../assets/pic3.jpg';
import pic4 from '../../assets/pic4.jpg';
import './Home.css';

const images = [pic1, pic2, pic3, pic4];

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span>CampusOrbit</span>
          </h1>
          <p className="hero-subtitle">
            Your all-in-one student engagement platform — connect, explore, and thrive on campus.
          </p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="btn-prime">Get Started</Link>
              <Link to="/events" className="btn-second">Explore Events</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURES / GALLERY ===== */}
      <section className="gallery-section">
        <h2 className="section-title">✨ Explore Our Campus</h2>
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
