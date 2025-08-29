const mongoose = require('mongoose');
const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  console.debug('createMeeting request start', {
    params: req.params,
    body: req.body,
    user: req.user && { userId: req.user.userId, role: req.user.role },
  });
  try {
    if (!req.user || !req.user.userId) {
      console.warn('createMeeting - unauthenticated');
      return res.status(401).json({ error: 'Invalid user, please login' });
    }

    const { clubId } = req.params;
    if (!clubId || typeof clubId !== 'string' || !mongoose.isValidObjectId(clubId)) {
      console.warn('createMeeting - invalid clubId', clubId);
      return res.status(400).json({ error: 'Invalid clubId' });
    }

    const { title, agenda, location, scheduledAt } = req.body;
    const organizerId = req.user.userId;

    if (!title || !scheduledAt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const meetingDate = new Date(scheduledAt);
    if (isNaN(meetingDate)) {
      return res.status(400).json({ error: 'Invalid scheduledAt date' });
    }
    console.debug('createMeeting - meetingDate parsed', meetingDate);

    const meeting = new Meeting({
      clubId,
      organizerId,
      title,
      agenda: agenda || '',
      location: location || '',
      scheduledAt: meetingDate,
    });

    console.debug('createMeeting - before save');
    await meeting.save();
    console.debug('createMeeting - after save', { meetingId: meeting._id });

    return res.status(201).json({ message: 'Meeting created', meeting });
  } catch (err) {
    console.error('createMeeting error', err.stack || err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};


exports.getMeetingsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    if (!clubId || !mongoose.isValidObjectId(clubId)) {
      return res.status(400).json({ error: 'Invalid clubId' });
    }
    const meetings = await Meeting.find({ clubId }).sort({ scheduledAt: -1 });
    return res.json(meetings);
  } catch (err) {
    console.error('getMeetingsByClub error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const { meetingId } = req.params;
    if (!meetingId || !mongoose.isValidObjectId(meetingId)) {
      return res.status(400).json({ error: 'Invalid meetingId' });
    }
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    return res.json(meeting);
  } catch (err) {
    console.error('getMeetingById error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};