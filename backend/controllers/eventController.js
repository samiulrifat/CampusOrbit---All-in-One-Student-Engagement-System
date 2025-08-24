const Event = require('../models/Event');
const Club = require('../models/Club');

// Get all events, sorted by date ascending
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error getting events:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error getting event by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create event — require club admin authorization done in route middleware
exports.createEvent = async (req, res) => {
  try {
    const { title, date, location, description, clubId } = req.body;
    const userId = req.user.userId || req.user._id;

    // Double check authorization server-side as secure practice
    const club = await Club.findById(clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to create event for this club' });
    }

    const event = new Event({
      title,
      date,
      location,
      description,
      clubId
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event — verify club admin authorization in route
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user.userId || req.user._id;
    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body); // Update with new fields
    await event.save();

    res.json({ message: 'Event updated', event });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event — verify club admin authorization in route
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user.userId || req.user._id;
    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.deleteOne({ _id: req.params.id });

    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Photo upload handler — verify club admin authorization in route
exports.uploadEventPhotos = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user.userId || req.user._id;
    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to upload photos for this event' });
    }

    const photoFiles = req.files;
    if (!photoFiles || photoFiles.length === 0) {
      return res.status(400).json({ message: 'No photos uploaded' });
    }

    // Add uploaded photo filenames to event photos array
    const photoPaths = photoFiles.map(file => file.filename);
    event.photos = event.photos ? event.photos.concat(photoPaths) : photoPaths;

    await event.save();

    res.json({ message: 'Photos uploaded successfully', photos: event.photos });
  } catch (err) {
    console.error('Error uploading photos:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// RSVP toggle - accessible by authenticated users
exports.toggleRSVP = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = req.user.userId || req.user._id;

    // Toggle RSVP
    const index = event.attendees ? event.attendees.indexOf(userId) : -1;
    if (index === -1) {
      // Add attendee
      event.attendees = event.attendees ? [...event.attendees, userId] : [userId];
    } else {
      // Remove attendee
      event.attendees.splice(index, 1);
    }

    await event.save();

    res.json({ message: 'RSVP updated', attendees: event.attendees });
  } catch (err) {
    console.error('Error toggling RSVP:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get attendees - accessible by club admins only
exports.getAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('attendees', 'name email');
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = req.user.userId || req.user._id;
    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to view attendees' });
    }

    res.json(event.attendees);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Club admin can remove individual attendee
exports.removeAttendee = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = req.user.userId || req.user._id;
    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to remove attendees' });
    }

    const removeUserId = req.params.userId;
    event.attendees = event.attendees.filter(id => String(id) !== String(removeUserId));
    await event.save();

    res.json({ message: 'Attendee removed', attendees: event.attendees });
  } catch (err) {
    console.error('Error removing attendee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Filter events based on query params (optional)
exports.getFilteredEvents = async (req, res) => {
  try {
    // Implement your filtering logic here (date ranges, club, etc.)
    const filter = {};
    if (req.query.clubId) {
      filter.clubId = req.query.clubId;
    }
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching filtered events:', err);
    res.status(500).json({ message: 'Server error' });
  }
};