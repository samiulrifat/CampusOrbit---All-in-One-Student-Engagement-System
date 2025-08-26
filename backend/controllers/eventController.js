const Event = require('../models/Event');
const Club = require('../models/Club');

// Get all events, sorted by date ascending, with club name populated
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('clubId', 'name')   // Populate club name here
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error getting events:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event by ID with club name populated
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('clubId', 'name');  // Populate club name here
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error getting event by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create event — remain unchanged, already accepts clubId
exports.createEvent = async (req, res) => {
  // ... your existing createEvent code ...
};

// Update event — remain unchanged
exports.updateEvent = async (req, res) => {
  // ... your existing updateEvent code ...
};

// Delete event — remain unchanged
exports.deleteEvent = async (req, res) => {
  // ... your existing deleteEvent code ...
};

// Upload photos — remain unchanged
exports.uploadEventPhotos = async (req, res) => {
  // ... your existing uploadEventPhotos code ...
};

// RSVP toggle — remain unchanged
exports.toggleRSVP = async (req, res) => {
  // ... your existing toggleRSVP code ...
};

// Get attendees — remain unchanged
exports.getAttendees = async (req, res) => {
  // ... your existing getAttendees code ...
};

// Remove attendee — remain unchanged
exports.removeAttendee = async (req, res) => {
  // ... your existing removeAttendee code ...
};

// Filter events based on query params with club name populated
exports.getFilteredEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.clubId) {
      filter.clubId = req.query.clubId;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    const events = await Event.find(filter)
      .populate('clubId', 'name')   // Populate club name here
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching filtered events:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
