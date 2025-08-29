const jwt = require('jsonwebtoken');
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
    req.user = decoded; // { userId, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Role-based access middleware
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(403).json({ error: 'Forbidden' });
    let userRole = req.user.role;
    if (userRole === 'organizer') userRole = 'club_admin';
    if (!allowedRoles.includes(userRole)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}

// Check if user is club_admin or club member with admin/officer role
async function requireOfficer(req, res, next) {
  try {
    const clubId = req.params.clubId || req.params.id || req.body.clubId;
    if (!clubId) return res.status(400).json({ error: 'Club ID is required' });
    if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });

    const Club = require('../models/Club'); // lazy require to avoid circular import
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    // app-level club_admin bypass
    if (req.user.role === 'club_admin') return next();

    // otherwise check membership role
    const member = club.members.find(m => String(m.userId) === String(req.user.userId));
    if (member && (member.role === 'admin' || member.role === 'officer')) return next();

    return res.status(403).json({ error: 'Access denied: not club admin' });
  } catch (err) {
    console.error('Authorization error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Check if user is a club member
async function isClubMember(req, res, next) {
  try {
    const clubId = req.params.clubId || req.params.id || req.body.clubId;
    if (!clubId) return res.status(400).json({ error: 'Club ID is required' });
    if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });

    const Club = require('../models/Club');
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    const isMember = club.members.some(m => String(m.userId) === String(req.user.userId));
    if (!isMember) return res.status(403).json({ error: 'Access denied: not a club member' });

    return next();
  } catch (err) {
    console.error('Authorization error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  verifyToken,
  requireRole,
  requireOfficer,
  isClubMember,
};