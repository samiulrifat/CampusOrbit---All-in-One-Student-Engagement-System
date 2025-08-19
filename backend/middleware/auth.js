const jwt = require('jsonwebtoken');
const Club = require('../models/Club');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded contains userId, role, etc.
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Check if user is officer/admin of a given club
async function requireOfficer(req, res, next) {
  try {
    // clubId can come from route params or request body
    const clubId = req.params.clubId || req.params.id || req.body.clubId;
    console.log('requireOfficer middleware - clubId:', clubId, 'userId:', req.user?.userId);
    if (!clubId) return res.status(400).json({ error: 'Club ID is required' });

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    // Check if user is member and has role officer or admin
    const member = club.members.find(m => m.userId.toString() === req.user.userId);
    if (!member || !['officer', 'admin'].includes(member.role)) {
      return res.status(403).json({ error: 'Access denied: not officer/admin' });
    }

    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Check if user is a member of the club
async function isClubMember(req, res, next) {
  try {
    const clubId = req.params.clubId || req.params.id || req.body.clubId;
    if (!clubId) return res.status(400).json({ error: 'Club ID is required' });

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    // Check if user is in club members list
    const isMember = club.members.some(m => m.userId.toString() === req.user.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied: not a club member' });
    }

    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// (Optional) Retain requireOrganizer in case you have other routes needing this role
function requireOrganizer(req, res, next) {
  if (!req.user || req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Access denied: organizer role required' });
  }
  next();
}

module.exports = { verifyToken, requireOfficer, requireOrganizer, isClubMember };
