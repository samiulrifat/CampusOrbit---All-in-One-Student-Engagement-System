import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventPage from './pages/EventPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for viewing/RSVPing a single event */}
        <Route path="/events/:id" element={<EventPage />} />
      </Routes>
    </Router>
  );
}

export default App;



