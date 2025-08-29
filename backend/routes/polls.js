const express = require('express');
const router = express.Router();
const { verifyToken, requireOfficer, isClubMember } = require('../middleware/auth');
const pollController = require('../controllers/pollController');

router.post('/:clubId', verifyToken, requireOfficer, pollController.createPoll);
router.get('/club/:clubId', verifyToken, isClubMember, pollController.getPollsByClub);
router.post('/:pollId/vote', verifyToken, isClubMember, pollController.vote);

module.exports = router;