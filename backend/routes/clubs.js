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
  deleteClub,
} = require('../controllers/clubController');

const { verifyToken, requireOfficer } = require('../middleware/auth');

// Authenticated user can get list of clubs they belong to
router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const clubs = await Club.find({ 'members.userId': userId }).select('_id name');
    res.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs for user:', err);
    res.status(500).json({ error: 'Server error fetching clubs' });
  }
});

// Public: list all clubs
router.get('/', getClubs);

// Public: get single club details
router.get('/:id', getClubById);

// Auth: logged in users can create a club
router.post('/', verifyToken, createClub);

// Auth + Role: only club officers/admins can update
router.patch('/:id', verifyToken, requireOfficer, updateClubProfile);

// Auth + Role: invite a member
router.post('/:id/invite', verifyToken, requireOfficer, inviteMember);

// Auth + Role: remove a member
router.delete('/:id/remove', verifyToken, requireOfficer, removeMember);

// Auth + Role: delete club
router.delete('/:id', verifyToken, requireOfficer, deleteClub);

module.exports = router;
