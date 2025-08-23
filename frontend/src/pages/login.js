import React, { useState, useContext } from 'react';
import logo from '../assets/logo.png';
import './Login.css';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      setUser(data.user); // user={name, email, role}
      console.log('User logged in:', data.user);
      navigate('/user-dashboard');
      console.log('Navigation called');
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="CampusOrbit Logo" className="login-logo" />
        <h2>Welcome Back</h2>
        <p className="subtitle">Log in to access your dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
