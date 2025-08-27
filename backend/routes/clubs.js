const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const User = require('../models/User');

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

// User-specific routes

// ========================

// Get clubs where user is a member or creator (protected)
router.get('/user', verifyToken, async (req, res) => {
  try {
    console.log('Entered /api/clubs/user route');
    console.log('Decoded user from token:', req.user);

    const userId = req.user.userId;
    if (!userId) {
      console.log('No userId in token payload');
      return res.status(400).json({ error: 'User ID missing from token' });
    }


    const clubs = await Club.find({
      $or: [
        { creatorId: userId },
        { 'members.userId': userId }
      ]
    });

    console.log(`Found ${clubs.length} clubs for user ${userId}`);

    res.json(clubs);
  } catch (err) {
    console.error('Error fetching user clubs:', err);
    res.status(500).json({ error: 'Error fetching user clubs' });
  }
});

// Add member to a club (officer/admin only)
router.post('/:clubId/members', verifyToken, requireOfficer, async (req, res) => {
  try {
    const { clubId } = req.params;
    const { userId, role } = req.body; // role optional: 'member', 'officer', 'admin'

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    // Check if user is already a member
    if (club.members.some(m => m.userId.toString() === userId)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    // Add member to club
    club.members.push({ userId, role: role || 'member' });
    await club.save();

    // Add club to user's clubsJoined array if not present
    await User.findByIdAndUpdate(userId, { $addToSet: { clubsJoined: clubId } });

    res.json({ message: 'Member added successfully', club });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Error adding member to club' });
  }
});
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
