import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages (make sure names match exactly with the filenames)
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import ScheduleMeeting from './pages/ScheduleMeeting';
import MeetingsList from './pages/MeetingsList';
import CreatePoll from './pages/CreatePoll';
import PollsList from './pages/PollsList';

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

        <Route path="/schedule-meeting" element={<ScheduleMeeting />} /> 

        <Route path="/meetings" element={<MeetingsList />} /> 

        <Route path="/create-poll" element={<CreatePoll />} />

        <Route path="/polls" element={<PollsList />} />

      </Routes>
    </Router>
  );
}

export default App;