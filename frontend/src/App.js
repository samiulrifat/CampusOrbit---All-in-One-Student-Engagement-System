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
import EventPage from './pages/EventPage'; // ✅ Imported from the second part
import Dashboard from "./pages/Dashboard";
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

        {/* Schedule Meeting */}
        <Route path="/schedule-meeting" element={<ScheduleMeeting />} />

        {/* Meetings List */}
        <Route path="/meetings" element={<MeetingsList />} />

        {/* Create Poll */}
        <Route path="/create-poll" element={<CreatePoll />} />

        {/* Polls List */}
        <Route path="/polls" element={<PollsList />} />

        {/* ✅ Event Page Route */}
        <Route path="/events/:id" element={<EventPage />} />
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
