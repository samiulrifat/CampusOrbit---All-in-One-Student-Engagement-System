const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventPhotos
} = require("../models/eventController");

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + "-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// CRUD routes
router.get("/", getEvents);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

// Photo upload route (max 5 photos per request)
router.post("/:id/photos", upload.array("photos", 5), uploadEventPhotos);

module.exports = router;
