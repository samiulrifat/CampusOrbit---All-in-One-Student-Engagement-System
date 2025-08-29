const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { verifyToken, requireOfficer, isClubMember } = require('../middleware/auth');

// Create a new meeting (officer only)
router.post('/', verifyToken, requireOfficer, async (req, res) => {
  try {
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

    res.status(201).json({ message: 'Meeting scheduled successfully', meeting });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get meetings for a club (club member only)
router.get('/:clubId', verifyToken, isClubMember, async (req, res) => {
  try {
    const { clubId } = req.params;

    const meetings = await Meeting.find({ clubId }).populate('organizerId', 'name email');

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send invites (officer only)
router.post('/:meetingId/invite', verifyToken, requireOfficer, async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    if (meeting.invitationsSent) {
      return res.status(400).json({ error: 'Invitations already sent' });
    }

    meeting.invitationsSent = true;
    await meeting.save();

    res.json({ message: 'Invitations sent successfully' });
  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark attendance (authenticated user)
router.post('/:meetingId/attend', verifyToken, async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    if (meeting.attendees.includes(userId)) {
      return res.status(400).json({ error: 'Attendance already recorded' });
    }

    meeting.attendees.push(userId);
    await meeting.save();

    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
