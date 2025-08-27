import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Create the context
const ClubContext = createContext(null);

// Provider component
export function ClubProvider({ children }) {
  const [clubs, setClubs] = useState([]);          // Array of club objects [{ _id, name, ... }]
  const [selectedClubId, setSelectedClubId] = useState(null); // String club _id

  // When clubs list is populated and no selection yet, pick the first by default
  useEffect(() => {
    if (!selectedClubId && clubs && clubs.length > 0) {
      setSelectedClubId(String(clubs[0]._id));
    }
  }, [clubs, selectedClubId]);

  const value = useMemo(() => ({
    clubs,
    setClubs,
    selectedClubId,
    setSelectedClubId,
  }), [clubs, selectedClubId]);

  return (
    <ClubContext.Provider value={value}>
      {children}
    </ClubContext.Provider>
  );
}

// Hook to use the context
export function useClub() {
  const ctx = useContext(ClubContext);
  if (!ctx) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return ctx;
}
