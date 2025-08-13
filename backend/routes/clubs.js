const express = require('express');
const router = express.Router();

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

// ===== Club Routes ===== //

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
