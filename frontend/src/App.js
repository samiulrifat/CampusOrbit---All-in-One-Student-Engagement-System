import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your AuthProvider from the new context file
import { AuthProvider } from './context/AuthProvider';

// Import pages (ensure correct paths)
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import ClubDashboard from './pages/ClubDashboard';
import ClubEventsPage from './pages/ClubEventsPage'; // new events page
import ScheduleMeeting from './pages/ScheduleMeeting';
import MeetingsList from './pages/MeetingsList';
import CreatePoll from './pages/CreatePoll';
import PollsList from './pages/PollsList';
import ClubManagement from './pages/ClubManagement';
import EventPage from './pages/EventPage';
import ClubWorkspace from './pages/ClubWorkspace';
import AchievementsPage from './pages/AchievementsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EventCalendar from './components/Events/EventCalendar';

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
          <Route path="/user-dashboard" element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } />

          {/* Club Dashboard with nested routes */}
          <Route path="/club-dashboard" element={
            <PrivateRoute>
              <ClubDashboard />
            </PrivateRoute>
          }>
            {/* This is the index route shown at /club-dashboard */}
            <Route index element={<div>Welcome to Club Dashboard</div>} />
            {/* Nested route for club events management at /club-dashboard/events */}
            <Route path="events" element={<ClubEventsPage />} />
            {/* Add other nested routes for polls/meetings if you want */}
          </Route>

          <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/meetings" element={<MeetingsList />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/polls" element={<PollsList />} />
          <Route path="/clubs/manage" element={<ClubManagement />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/clubs/:clubId/workspace" element={<ClubWorkspace />} />
          <Route path="/clubs/:clubId/achievements" element={<AchievementsPage />} />
          <Route path="/clubs/:clubId/announcements" element={<AnnouncementsPage />} />
          <Route path="/calendar" element={<EventCalendar />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
