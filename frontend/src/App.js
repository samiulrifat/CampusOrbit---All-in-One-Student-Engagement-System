import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your AuthProvider from the new context file
import { AuthProvider } from './context/AuthProvider';

// Import pages (ensure correct paths)
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import ScheduleMeeting from './pages/ScheduleMeeting';
import MeetingsList from './pages/MeetingsList';
import CreatePoll from './pages/CreatePoll';
import PollsList from './pages/PollsList';
import ClubManagement from './pages/ClubManagement';
import Dashboard from './pages/Dashboard';
import EventPage from './pages/EventPage';
import ClubWorkspace from './pages/ClubWorkspace';
import AchievementsPage from './pages/AchievementsPage';

// Global CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Your routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/meetings" element={<MeetingsList />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/polls" element={<PollsList />} />
          <Route path="/clubs/manage" element={<ClubManagement />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/clubs/:clubId/workspace" element={<ClubWorkspace />} />
          <Route path="/clubs/:clubId/achievements" element={<AchievementsPage />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
