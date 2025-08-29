const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Event = require('../models/Event');
const Club = require('../models/Club');
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Multer setup for event photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/eventphotos');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// GET all events sorted by date ascending (public or protected)
router.get('/', eventController.getEvents);

// RSVP toggle (authenticated students)
router.post('/:eventId/rsvp', verifyToken, eventController.toggleRSVP);

// Organizer (club admin) views attendee list
router.get('/:eventId/attendees', verifyToken, requireRole(['clubAdmin']), eventController.getAttendees);

// Organizer (club admin) removes an attendee
router.delete('/:eventId/attendees/:userId', verifyToken, requireRole(['clubAdmin']), eventController.removeAttendee);

// GET event by ID (authenticated users)
router.get('/:id', verifyToken, eventController.getEventById);

// CREATE event (only clubAdmin) with authorization check
router.post('/', verifyToken, requireRole(['clubAdmin']), async (req, res) => {
  try {
    const { title, date, location, description, clubId } = req.body;
    const userId = req.user.userId || req.user._id;

    // Authorization check: must be creator of club
    const club = await Club.findById(clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to create events for this club" });
    }

    // Delegate to controller create
    eventController.createEvent(req, res);
  } catch (err) {
    console.error('Error in event creation route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE event by ID (only clubAdmin) with authorization check
router.put('/:id', verifyToken, requireRole(['clubAdmin']), async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    // Delegate to controller update
    eventController.updateEvent(req, res);
  } catch (err) {
    console.error('Error in event update route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE event by ID (only clubAdmin) with authorization check
router.delete('/:id', verifyToken, requireRole(['clubAdmin']), async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    // Delegate to controller delete
    eventController.deleteEvent(req, res);
  } catch (err) {
    console.error('Error in event delete route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPLOAD photos for event (only clubAdmin) with authorization check
router.post('/:id/photos', verifyToken, requireRole(['clubAdmin']), upload.array('photos', 5), async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const club = await Club.findById(event.clubId);
    if (!club || String(club.creatorId) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to upload photos for this event" });
    }

    // Delegate to controller photo upload
    eventController.uploadEventPhotos(req, res);
  } catch (err) {
    console.error('Error uploading event photos:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW: Filtered events endpoint calling controller method (public)
router.get('/filter', eventController.getFilteredEvents);

module.exports = router;