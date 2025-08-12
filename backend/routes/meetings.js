const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const User = require('../models/User');

// Middleware for auth and officer role verification can be added here

// Create a new meeting (officer only)
router.post('/', async (req, res) => {
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

// Get meetings for a club
router.get('/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;

    const meetings = await Meeting.find({ clubId }).populate('organizerId', 'name email');

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send invites - for demonstration, just mark invitationsSent true
router.post('/:meetingId/invite', async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    if (meeting.invitationsSent) {
      return res.status(400).json({ error: 'Invitations already sent' });
    }

    // Here, implement actual invitation sending (email/notifications) as needed
    // For now, just mark it as sent
    meeting.invitationsSent = true;
    await meeting.save();

    res.json({ message: 'Invitations sent successfully' });
  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark attendance for a meeting - usually member confirms own attendance
router.post('/:meetingId/attend', async (req, res) => {
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
