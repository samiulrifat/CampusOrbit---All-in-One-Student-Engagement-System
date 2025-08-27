const User = require('../models/User');

module.exports = async function getUserClubs(req, res, next) {
  try {
    const uid = String(req.user?.userId || '');
    if (!uid) return res.status(401).json({ error: 'Unauthorized user' });

    const user = await User.findById(uid).select('clubsJoined').lean();
    const clubs = (user?.clubsJoined || []).map((id) => String(id));
    req.userClubs = clubs;
    return next();
  } catch (err) {
    console.error('getUserClubs error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
