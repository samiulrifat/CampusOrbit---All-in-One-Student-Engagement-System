import React from 'react';
import EventManager from '../../components/Events/EventManager';

function ClubEventsPage() {
  return (
    <>
      <div className="container mt-4">
        <h1>Event Creation and Management</h1>
        <EventManager />
      </div>
    </>
  );
}

export default ClubEventsPage;