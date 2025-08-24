const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { verifyToken, isClubMember } = require('../middleware/auth'); // Implement isClubMember for authorization
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/resources'); // Make sure folder exists or create it
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// Get all resources for a club
router.get('/:clubId', verifyToken, isClubMember, async (req, res) => {
  try {
    const resources = await Resource.find({ clubId: req.params.clubId }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

// Upload file resource
router.post('/upload/:clubId', verifyToken, isClubMember, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const resource = new Resource({
      clubId: req.params.clubId,
      uploader: req.user.userId,
      type: 'file',
      title: req.body.title || req.file.originalname,
      url: `/uploads/resources/${req.file.filename}`, 
      fileName: req.file.originalname,
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload resource' });
  }
});

// Add link resource
router.post('/link/:clubId', verifyToken, isClubMember, async (req, res) => {
  try {
    const { title, url } = req.body;
    if (!title || !url) return res.status(400).json({ message: 'Title and URL are required' });
    const resource = new Resource({
      clubId: req.params.clubId,
      uploader: req.user.userId,
      type: 'link',
      title,
      url,
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add link' });
  }
});

// Delete resource (by resource ID)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    // Add ownership or club admin verification if needed here
    if (resource.uploader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }
    await resource.remove();
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete resource' });
  }
});

module.exports = router;