const express = require('express');
const router = express.Router();

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
router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find clubs where user is a member OR the creator
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
router.get('/calendar', async (req, res) => {
  const clubs = await Club.find({}, 'name');
  res.json(clubs);
});

router.get('/', getClubs);
router.get('/:id', getClubById);
// Express (Node.js)
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




// ========================
// Authenticated actions
// ========================
router.post('/', verifyToken, createClub);
router.patch('/:id', verifyToken, requireOfficer, updateClubProfile);
router.post('/:id/invite', verifyToken, requireOfficer, inviteMember);
router.delete('/:id/remove', verifyToken, requireOfficer, removeMember);
router.delete('/:id', verifyToken, requireOfficer, deleteClub);

module.exports = router;
