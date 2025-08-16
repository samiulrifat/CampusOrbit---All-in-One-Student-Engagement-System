const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventPhotos,
} = require('../controllers/eventController');

console.log({ createEvent });

const Event = require('../models/Event');
const { verifyToken, requireOrganizer } = require('../middleware/auth');

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });


// Get all events
router.get('/', getEvents);

// Create a new event
router.post('/', verifyToken, requireOrganizer, createEvent);

// Update event by ID
router.put('/:id', verifyToken, requireOrganizer, updateEvent);

// Delete event by ID
router.delete('/:id', verifyToken, requireOrganizer, deleteEvent);

// Upload photos to event by ID (max 5 photos)
router.post('/:id/photos', verifyToken, requireOrganizer, upload.array('photos', 5), uploadEventPhotos);

// ===== RSVP and Attendee Routes =====

// Student toggles RSVP for an event
router.post('/:eventId/rsvp', verifyToken, async (req, res) => {
  try {
    const evt = await Event.findById(req.params.eventId);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user.userId;
    const index = evt.attendees.findIndex(id => id.toString() === userId);

    if (index === -1) {
      evt.attendees.push(userId);
    } else {
      evt.attendees.splice(index, 1);
    }
    await evt.save();

    res.json({ attendees: evt.attendees });
  } catch (err) {
    console.error('Error toggling RSVP:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Organizer views full attendee list for an event
router.get('/:eventId/attendees', verifyToken, requireOrganizer, async (req, res) => {
  try {
    const evt = await Event.findById(req.params.eventId).populate('attendees', 'name email');
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    res.json(evt.attendees);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Organizer removes an attendee from an event
router.delete('/:eventId/attendees/:userId', verifyToken, requireOrganizer, async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const evt = await Event.findById(eventId);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    evt.attendees = evt.attendees.filter(id => id.toString() !== userId);
    await evt.save();
    res.json({ message: 'Attendee removed' });
  } catch (err) {
    console.error('Error removing attendee:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
