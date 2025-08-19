const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const eventController = require('../controllers/eventController');

const { verifyToken, requireOfficer, requireOrganizer } = require('../middleware/auth');

// Multer setup for event photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadsphoto/'); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Upload photos for event by ID (max 5 photos)
router.post('/:id/photos', verifyToken, requireOfficer, upload.array('photos', 5), eventController.uploadEventPhotos);

// Debug logs (placed after imports)
console.log('verifyToken:', verifyToken);
console.log('toggleRSVP:', eventController.toggleRSVP);
console.log('uploadEventPhotos', eventController.uploadEventPhotos);

// GET all events sorted by date ascending
router.get('/', eventController.getEvents);

// RSVP toggle (authenticated students)
router.post('/:eventId/rsvp', verifyToken, eventController.toggleRSVP);

// Organizer (club admin) views attendee list
router.get('/:eventId/attendees', requireOrganizer, eventController.getAttendees);

// Organizer (club admin) removes an attendee
router.delete('/:eventId/attendees/:userId', requireOrganizer, eventController.removeAttendee);

// GET event by ID (authenticated users) - placed after specific routes to avoid route conflicts
router.get('/:id', verifyToken, eventController.getEventById);

// CREATE event (only officer/admin)
router.post('/', verifyToken, requireOfficer, eventController.createEvent);

// UPDATE event by ID (only officer/admin)
router.put('/:id', verifyToken, requireOfficer, eventController.updateEvent);

// DELETE event by ID (only officer/admin)
router.delete('/:id', verifyToken, requireOfficer, eventController.deleteEvent);

// NEW: GET filtered events for calendar view
router.get('/filter', async (req, res) => {
  try {
    const { category, startDate, endDate, clubId } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (clubId) {
      filter.clubId = clubId;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const events = await eventController.Event.find(filter)
      .sort({ date: 1 })
      .populate('clubId', 'name');

    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching filtered events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
