const express = require('express');
const router = express.Router();

const Meeting = require('../models/Meeting');
const { verifyToken, requireOfficer } = require('../middleware/auth');
const getUserClubs = require('../middleware/getUserClubs');

// simple async wrapper
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Batch list: GET /api/meetings?clubIds=a,b,c
router.get('/', verifyToken, asyncH(async (req, res) => {
  const clubIdsParam = String(req.query.clubIds || '');
  const ids = clubIdsParam.split(',').map(s => s.trim()).filter(Boolean).map(String);
  if (ids.length === 0) return res.json([]);

  const meetings = await Meeting.find({ clubId: { $in: ids } })
    .populate('organizerId', 'name email')
    .lean();
  return res.json(meetings);
}));

// Per-club list: GET /api/meetings/:clubId (must be a club member)
router.get('/:clubId', verifyToken, getUserClubs, asyncH(async (req, res) => {
  const { clubId } = req.params;
  const cid = String(clubId);
  const memberships = Array.isArray(req.userClubs) ? req.userClubs.map(String) : [];
  if (!memberships.includes(cid)) {
    return res.status(403).json({ error: 'Access denied: not a member of this club' });
  }
  const meetings = await Meeting.find({ clubId: cid })
    .populate('organizerId', 'name email')
    .lean();
  return res.json(meetings);
}));

// Create meeting (officer/admin only)
async function scheduleMeeting(req, res) {
  const { clubId, organizerId, title, agenda, location, scheduledAt } = req.body;
  if (!clubId || !organizerId || !title || !scheduledAt) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  const meeting = new Meeting({
    clubId,
    organizerId,
    title,
    agenda,
    location,
    scheduledAt,
  });
  await meeting.save();
  return res.status(201).json({ message: 'Meeting scheduled successfully', meeting });
}
router.post('/', verifyToken, requireOfficer, asyncH(scheduleMeeting));

// Send invites (officer/admin only)
router.post('/:meetingId/invite', verifyToken, requireOfficer, asyncH(async (req, res) => {
  const { meetingId } = req.params;
  const meeting = await Meeting.findById(meetingId);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  if (meeting.invitationsSent) {
    return res.status(400).json({ error: 'Invitations already sent' });
  }
  meeting.invitationsSent = true;
  await meeting.save();
  return res.json({ message: 'Invitations sent successfully' });
}));

// Mark attendance (authenticated user)
router.post('/:meetingId/attend', verifyToken, asyncH(async (req, res) => {
  const { meetingId } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  const meeting = await Meeting.findById(meetingId);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  const already = meeting.attendees.some((id) => String(id) === String(userId));
  if (already) return res.status(400).json({ error: 'Attendance already recorded' });

  meeting.attendees.push(userId);
  await meeting.save();
  return res.json({ message: 'Attendance recorded successfully' });
}));

module.exports = router;
