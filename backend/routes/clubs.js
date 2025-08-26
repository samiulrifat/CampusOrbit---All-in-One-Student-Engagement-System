const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

const {
  createClub,
  getClubs,
  getClubById,
  updateClubProfile,
  inviteMember,
  removeMember,
  deleteClub
} = require('../controllers/clubController');

const { verifyToken, requireOfficer } = require('../middleware/auth');

// ========================
// User-specific routes
// ========================

// Get clubs where user is a member or creator (protected)
router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const clubs = await Club.find({
      $or: [
        { creatorId: userId },
        { 'members.userId': userId }
      ]
    });

    res.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs for user:', err);
    res.status(500).json({ error: 'Server error fetching clubs' });
  }
});

// ========================
// Public routes
// ========================

// Public route to get all club names for calendar or dropdown
router.get('/calendar', async (req, res) => {
  try {
    const clubs = await Club.find({}, 'name');
    res.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs for calendar:', err);
    res.status(500).json({ error: 'Server error fetching clubs' });
  }
});

// Get all clubs (calls controller)
router.get('/', getClubs);

// Get one club by ID (calls controller)
router.get('/:id', getClubById);

// Get club invitations for user (protected and populated)
router.get("/invitations/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const clubs = await Club.find({
      $or: [
        { creatorId: userId },
        { 'members.userId': userId }
      ]
    })
    .populate('members.userId', 'name email')
    .populate('creatorId', 'name email');

    res.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs for user:', err);
    res.status(500).json({ error: 'Server error fetching clubs' });
  }
});

// ========================
// Authenticated actions
// ========================

// Create club (protected)
router.post('/', verifyToken, createClub);

// Update club profile (protected, officer only)
router.patch('/:id', verifyToken, requireOfficer, updateClubProfile);

// Invite member (protected, officer only)
router.post('/:id/invite', verifyToken, requireOfficer, inviteMember);

// Remove member (protected, officer only)
router.delete('/:id/remove', verifyToken, requireOfficer, removeMember);

// Delete club (protected, officer only)
router.delete('/:id', verifyToken, requireOfficer, deleteClub);

module.exports = router;
