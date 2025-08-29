const express = require('express');
const router = express.Router();
const SponsorshipRequest = require('../models/SponsorshipRequest');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { verifyToken, requireOfficer } = require('../middleware/auth');

// adapt officer check for event (requireOfficer expects clubId)
async function requireOfficerForEvent(req, res, next) {
  try {
    const evt = await Event.findById(req.params.eventId).select('clubId');
    if (!evt) return res.status(404).json({ message: 'Event not found' });
    req.params.clubId = evt.clubId?.toString();
    return requireOfficer(req, res, next);
  } catch (e) {
    console.error('requireOfficerForEvent error:', e);
    res.status(500).json({ error: 'Server error' });
  }
}

// Organizer submits sponsorship request
router.post('/:eventId', verifyToken, requireOfficerForEvent, async (req, res) => {
  const { eventId } = req.params;
  const { companyName, amount, details } = req.body;

  const evt = await Event.findById(eventId).select('_id title');
  if (!evt) return res.status(404).json({ message: 'Event not found' });

  const doc = await SponsorshipRequest.create({
    event: eventId,
    organizer: req.user.userId,
    companyName,
    amount: Number(amount),
    details
  });

  res.status(201).json(doc);
});

// Admin list (simple inline admin check)
router.get('/', verifyToken, async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const status = req.query.status || 'pending';
  const items = await SponsorshipRequest.find({ status })
    .populate('event', 'title')
    .populate('organizer', 'name email')
    .sort({ createdAt: -1 });

  res.json(items);
});

// Admin decision
router.patch('/:id/decision', verifyToken, async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const { decision, note } = req.body;
  if (!['approved','rejected'].includes(decision)) {
    return res.status(400).json({ message: 'Invalid decision' });
  }

  const doc = await SponsorshipRequest.findById(req.params.id).populate('event', 'title');
  if (!doc) return res.status(404).json({ message: 'Request not found' });

  doc.status = decision;
  doc.decisionBy = req.user.userId;
  doc.decisionNote = note;
  await doc.save();

  await Notification.create({
    user: doc.organizer,
    type: 'sponsorship',
    title: `Sponsorship ${decision}`,
    message: `Your sponsorship request for "${doc.event.title}" was ${decision}.`,
    link: `/events/${doc.event._id}`
  });

  res.json(doc);
});

module.exports = router;