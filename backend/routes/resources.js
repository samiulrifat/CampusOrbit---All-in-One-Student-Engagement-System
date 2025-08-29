const express = require('express');
const router = express.Router();
const { verifyToken, requireOfficer, isClubMember } = require('../middleware/auth');
const resourceController = require('../controllers/resourceController');

router.post('/:clubId', verifyToken, requireOfficer, resourceController.createResource);
router.get('/club/:clubId', verifyToken, isClubMember, resourceController.getResourcesByClub);

module.exports = router;