const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const Club = require('../models/Club');
const { verifyToken } = require('../middleware/auth');
const getUserClubs = require('../middleware/getUserClubs');

const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Helper: check if the user is club_admin or officer for a club
async function isOfficerOrAdmin(userId, clubId) {
  if (!mongoose.isValidObjectId(clubId)) return false;
  const club = await Club.findById(clubId).select('members').lean();
  if (!club) return false;

  const uid = String(userId);
  const member = (club.members || []).find((m) => {
    const mid =
      (m?.userId && m.userId.toString && m.userId.toString()) ||
      (m && m.toString && m.toString());
    return String(mid) === uid;
  });

  const role = member?.role || null;
  return role === 'club_admin' || role === 'officer';
}

// Batch list for dashboard: GET /api/polls?clubIds=a,b,c
router.get('/', verifyToken, asyncH(async (req, res) => {
  const ids = String(req.query.clubIds || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(String);

  if (ids.length === 0) return res.json([]);

  const polls = await Poll.find({ clubId: { $in: ids } })
    .sort({ createdAt: -1 })
    .lean();

  return res.json(polls);
}));

// Per-club list for navbar: GET /api/polls/:clubId (members only)
router.get('/:clubId', verifyToken, getUserClubs, asyncH(async (req, res) => {
  const { clubId } = req.params;
  const memberships = Array.isArray(req.userClubs) ? req.userClubs.map(String) : [];
  if (!memberships.includes(String(clubId))) {
    return res.status(403).json({ error: 'Access denied: not a member of this club' });
  }
  const polls = await Poll.find({ clubId }).sort({ createdAt: -1 }).lean();
  return res.json(polls);
}));

// Create a poll (club_admin/officer)
router.post('/', verifyToken, asyncH(async (req, res) => {
  const { clubId, question, options } = req.body;
  const creatorId = req.user.userId || req.user._id;

  if (!clubId || !creatorId || !question || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({
      error: 'Please provide clubId, creatorId, question, and at least 2 options',
    });
  }

  const allowed = await isOfficerOrAdmin(creatorId, clubId);
  if (!allowed) return res.status(403).json({ error: 'Not authorized for this club.' });

  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { text: opt, votes: 0 } : opt
  );

  const poll = new Poll({
    clubId,
    creatorId,
    question,
    options: normalizedOptions,
    isOpen: true,
    voterIds: [],
  });

  await poll.save();
  return res.status(201).json({ message: 'Poll created', poll });
}));

// Vote (members; one vote per user)
router.post('/:pollId/vote', verifyToken, asyncH(async (req, res) => {
  const { pollId } = req.params;
  const { optionIndex } = req.body;
  const voterId = req.user.userId || req.user._id;

  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  if (!poll.isOpen) return res.status(400).json({ error: 'Poll is closed' });

  // Ensure the voter is a member of the poll's club
  const member = await Club.findOne({
    _id: poll.clubId,
    $or: [
      { 'members.userId': voterId }, // subdoc { userId, role }
      { members: voterId },          // raw ObjectId
    ],
  }).select('_id');

  if (!member) return res.status(403).json({ error: 'Not a member of this club' });

  if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({ error: 'Invalid option index' });
  }

  // Prevent double vote
  const alreadyVoted = (poll.voterIds || []).some((id) => String(id) === String(voterId));
  if (alreadyVoted) {
    return res.status(400).json({ error: 'You have already voted on this poll' });
  }

  poll.options[optionIndex].votes += 1;
  poll.voterIds = poll.voterIds || [];
  poll.voterIds.push(voterId);
  await poll.save();

  return res.json({ message: 'Vote recorded', poll });
}));

// Close a poll (club_admin/officer)
router.patch('/:pollId/close', verifyToken, asyncH(async (req, res) => {
  const { pollId } = req.params;
  const userId = req.user.userId || req.user._id;

  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  const allowed = await isOfficerOrAdmin(userId, poll.clubId);
  if (!allowed) return res.status(403).json({ error: 'Not authorized to close this poll.' });

  poll.isOpen = false;
  await poll.save();

  return res.json({ message: 'Poll closed', poll });
}));

module.exports = router;
