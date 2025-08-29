import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your AuthProvider from the new context file
import { AuthProvider } from './context/AuthProvider';

// Import pages (ensure correct paths)
import Home from './pages/Home/Home';
import Login from './pages/Login/login';
import Register from './pages/Registration/Register';
import ScheduleMeeting from './pages/Meeting/ScheduleMeeting';
import MeetingsList from './pages/Meeting/MeetingsList';
import CreatePoll from './pages/Poll/CreatePoll';
import PollsList from './pages/Poll/PollsList';
import ClubManagement from './pages/Club/ClubManagement';
import EventPage from './pages/Event/EventPage';
import ClubEventPage from './pages/Event/EventManager';
import ClubWorkspace from './pages/Club/ClubWorkspace';
import Achievements from './pages/Achievement/Achievements';
import Announcements from './pages/Announcement/Announcements';
import Notifications from './pages/Notifications/Notifications';
import AnnouncementList from './pages/Announcement/AnnouncementList';
import EventCalendar from './pages/Event/EventCalendar';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PrivateRoute from './context/PrivateRouter';
import Resources from './pages/Resources/ResourceList';
import Invitations from './pages/Club/Invitations';
import UploadResources from './pages/Resources/UploadResource';
import Members from './pages/Club/Member';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/schedule-meeting" element={<PrivateRoute><ScheduleMeeting /></PrivateRoute>} />
          <Route path="/meetings" element={<PrivateRoute><MeetingsList /></PrivateRoute>} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/polls" element={<PrivateRoute><PollsList /></PrivateRoute>} />
          <Route path="/clubs/manage" element={<PrivateRoute><ClubManagement /></PrivateRoute>} />
          <Route path="/events/:id" element={<PrivateRoute><EventPage /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><ClubEventPage /></PrivateRoute>} />
          <Route path="/invitations" element={<PrivateRoute><Members /></PrivateRoute>} />
          <Route path="/clubs/invitations/user" element={<PrivateRoute><Invitations /></PrivateRoute>} />
          <Route path="/clubs/resources/:clubId" element={<PrivateRoute><Resources /></PrivateRoute>} />
          <Route path="/clubs/resources/upload/:clubId" element={<PrivateRoute><UploadResources /></PrivateRoute>} />
          <Route path="/clubs/workspace/:clubId" element={<PrivateRoute><ClubWorkspace /></PrivateRoute>} />
          <Route path="/clubs/achievements/:clubId" element={<PrivateRoute><Achievements /></PrivateRoute>} />
          <Route path="/clubs/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
          <Route path="/clubs/announcements/list/:clubId" element={<PrivateRoute><AnnouncementList /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><EventCalendar /></PrivateRoute>} />
        </Routes>
        <Footer/>
      </Router>
    </AuthProvider>
  );
}

export default App;
