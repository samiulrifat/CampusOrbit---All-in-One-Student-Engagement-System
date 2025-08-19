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

const { verifyToken, requireOfficer } = require('../middleware/auth');

// Multer setup for event photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// GET all events sorted by date ascending
router.get('/', getEvents);

// CREATE event (only officer/admin)
router.post('/', verifyToken, requireOfficer, createEvent);

// UPDATE event by ID (only officer/admin)
router.put('/:id', verifyToken, requireOfficer, updateEvent);

// DELETE event by ID (only officer/admin)
router.delete('/:id', verifyToken, requireOfficer, deleteEvent);

// UPLOAD photos for event (only officer/admin)
router.post('/:id/photos', verifyToken, requireOfficer, upload.array('photos', 5), uploadEventPhotos);

module.exports = router;
