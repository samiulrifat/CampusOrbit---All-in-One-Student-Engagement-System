import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventPage from './pages/EventPage';

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, {
        path: "/events/:id",
        element: React.createElement(EventPage)
      })
    )
  );
}

export default App;
