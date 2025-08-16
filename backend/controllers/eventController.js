const Event = require("../models/Event");

// GET all events sorted by date (ascending)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error while fetching events" });
  }
};

// CREATE event with required validation
exports.createEvent = async (req, res) => {
  const { title, date, location, description } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ message: "Title, date, and location are required" });
  }

  try {
    const newEvent = new Event({ title, date, location, description, photos: [] });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error while creating event" });
  }
};

// UPDATE event with validation and options to return updated doc
exports.updateEvent = async (req, res) => {
  const { title, date, location, description } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ message: "Title, date, and location are required" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, location, description },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
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

// UPLOAD event photos; expects multer middleware to populate req.files
exports.uploadEventPhotos = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Map uploaded file paths to URLs
    const fileUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);

    // Append new photos to existing array
    event.photos = event.photos.concat(fileUrls);
    await event.save();

    res.status(200).json({ message: "Photos uploaded successfully", photos: event.photos });
  } catch (err) {
    console.error("Error uploading photos:", err);
    res.status(500).json({ message: "Failed to upload photos" });
  }
};
