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

// Public routes

router.get('/calendar', async (req, res) => {
  const clubs = await Club.find({}, 'name');
  res.json(clubs);
});

router.get('/', getClubs);
router.get('/:id', getClubById);
router.get("/invitations/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find clubs where user is creator OR member
    const clubs = await Club.find({
      $or: [
        { creatorId: userId },
        { 'members.userId': userId }
      ]
    }).populate('members.userId', 'name email') // populate member details
      .populate('creatorId', 'name email');     // populate creator details

    res.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs for user:', err);
    res.status(500).json({ error: 'Server error fetching clubs' });
  }
});


router.post('/', verifyToken, createClub);
router.patch('/:id', verifyToken, requireOfficer, updateClubProfile);
router.post('/:id/invite', verifyToken, requireOfficer, inviteMember);
router.delete('/:id/remove', verifyToken, requireOfficer, removeMember);
router.delete('/:id', verifyToken, requireOfficer, deleteClub);

module.exports = router;
