// backend/middleware/auth.js
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
    req.user = decoded; // decoded will have userId, role etc.
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Check if user is officer/admin of a given club
async function requireOfficer(req, res, next) {
  try {
    const clubId = req.params.id || req.body.clubId;
    if (!clubId) return res.status(400).json({ error: 'Club ID is required' });

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

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

module.exports = { verifyToken, requireOfficer };
