// routes/events.js
const express = require('express');
const router = express.Router();
const Event  = require('../models/Event');
const { auth, organizerAuth } = require('../middleware/auth');

// 1. Student toggles RSVP
router.post('/:eventId/rsvp', auth, async (req, res) => {
  try {
    const evt = await Event.findById(req.params.eventId);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    const uid = req.user.id;
    const idx = evt.attendees.indexOf(uid);
    if (idx === -1) {
      evt.attendees.push(uid);
    } else {
      evt.attendees.splice(idx, 1);
    }
    await evt.save();

    res.json({ attendees: evt.attendees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Organizer views full attendee list
router.get('/:eventId/attendees', organizerAuth, async (req, res) => {
  try {
    const evt = await Event
      .findById(req.params.eventId)
      .populate('attendees', 'name email');
    if (!evt) return res.status(404).json({ message: 'Event not found' });
    res.json(evt.attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Organizer removes an attendee
router.delete('/:eventId/attendees/:userId', organizerAuth, async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const evt = await Event.findById(eventId);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    evt.attendees = evt.attendees.filter(id => id.toString() !== userId);
    await evt.save();
    res.json({ message: 'Attendee removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
