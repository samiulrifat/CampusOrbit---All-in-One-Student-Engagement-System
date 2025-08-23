import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <img
        src={logo}
        alt="CampusOrbit Logo"
        className="app-logo"
        onClick={() => navigate('/user-dashboard')}
        style={{ cursor: 'pointer' }}
      />
    </header>
  );
}

export default Header;
