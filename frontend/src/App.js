import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages (make sure names match exactly with the filenames)
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import ScheduleMeeting from './pages/ScheduleMeeting';

// Global CSS (optional, you can keep App.css from CRA)
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        <Route path="/schedule-meeting" element={<ScheduleMeeting />} /> {/* New */}
      </Routes>
    </Router>
  );
}

export default App;