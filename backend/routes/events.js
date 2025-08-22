const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const eventController = require('../controllers/eventController');

const { verifyToken, requireOfficer, requireOrganizer } = require('../middleware/auth');

// Multer setup for event photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/eventphotos');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Debug logs (placed after imports)
console.log('verifyToken:', verifyToken);
console.log('toggleRSVP:', eventController.toggleRSVP);

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

// UPLOAD photos for event (only officer/admin)
router.post('/:id/photos', verifyToken, requireOfficer, upload.array('photos', 5), eventController.uploadEventPhotos);

module.exports = router;
