const Event = require("../models/Event");
const Club = require("../models/Club"); // Needed to check club admin
const { notifyEventChange } = require('../utils/notifyEventChange');

// Helper to check if user is the club admin of the event
const isClubAdmin = async (userId, event) => {
  if (!event || !event.clubId) return false;
  const club = await Club.findById(event.clubId);
  if (!club) return false;
  return club.creatorId.toString() === userId.toString();
};

// GET all events sorted by date ascending
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error while fetching events" });
  }
};

// GET event by ID (populate attendees)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees', 'name email');
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Server error while fetching event" });
  }
};

// CREATE event with validation including clubId
exports.createEvent = async (req, res) => {
  const { title, date, location, description, clubId } = req.body;
  if (!title || !date || !location || !clubId) {
    return res.status(400).json({ message: "Title, date, location and clubId are required" });
  }

  try {
    const newEvent = new Event({ title, date, location, description, clubId, photos: [], attendees: [] });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error while creating event" });
  }
};

// UPDATE event with validation including clubId, plus notify attendees on changed fields
exports.updateEvent = async (req, res) => {
  const { title, date, location, description, clubId } = req.body;
  if (!title || !date || !location || !clubId) {
    return res.status(400).json({ message: "Title, date, location and clubId are required" });
  }

  try {
    const current = await Event.findById(req.params.id);
    if (!current) return res.status(404).json({ message: "Event not found" });

    const before = current.toObject();

    current.title = title;
    current.date = date;
    current.location = location;
    current.description = description;
    current.clubId = clubId;

    await current.save();

    const changed = ['title','date','location','description'].filter(
      f => String(before[f]) !== String(current[f])
    );

    // Notify attendees about event changes asynchronously
    notifyEventChange(current._id, changed).catch(console.error);

    res.status(200).json(current);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error while updating event" });
  }
};

// DELETE event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error while deleting event" });
  }
};

exports.uploadEventPhotos = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const fileUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);

    event.photos = event.photos.concat(fileUrls);
    await event.save();

    res.status(200).json({ message: "Photos uploaded successfully", photos: event.photos });
  } catch (err) {
    console.error("Error uploading photos:", err);
    res.status(500).json({ message: "Failed to upload photos" });
  }
};

// =======================
// New functionality below
// =======================

// Student toggles RSVP - adds/removes from attendees array
exports.toggleRSVP = async (req, res) => {
  try {
    const evt = await Event.findById(req.params.eventId);
    if (!evt) return res.status(404).json({ message: "Event not found" });

    const uid = req.user.userId || req.user.id;
    const idx = evt.attendees.findIndex(id => id.toString() === uid);
    if (idx === -1) {
      evt.attendees.push(uid);
    } else {
      evt.attendees.splice(idx, 1);
    }

    await evt.save();
    res.json({ attendees: evt.attendees });
  } catch (err) {
    console.error("Error toggling RSVP:", err);
    res.status(500).json({ message: err.message });
  }
};

// Organizer (club admin) views full attendee list
exports.getAttendees = async (req, res) => {
  try {
    const evt = await Event.findById(req.params.eventId).populate('attendees', 'name email');
    if (!evt) return res.status(404).json({ message: "Event not found" });

    const isAdmin = await isClubAdmin(req.user.userId, evt);
    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied: not club admin" });
    }

    res.json(evt.attendees);
  } catch (err) {
    console.error("Error fetching attendees:", err);
    res.status(500).json({ message: err.message });
  }
};

// Organizer (club admin) removes an attendee
exports.removeAttendee = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const evt = await Event.findById(eventId);
    if (!evt) return res.status(404).json({ message: "Event not found" });

    const isAdmin = await isClubAdmin(req.user.userId, evt);
    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied: not club admin" });
    }

    evt.attendees = evt.attendees.filter(id => id.toString() !== userId);
    await evt.save();

    res.json({ message: "Attendee removed" });
  } catch (err) {
    console.error("Error removing attendee:", err);
    res.status(500).json({ message: err.message });
  }
};
