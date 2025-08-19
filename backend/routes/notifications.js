const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');
const { generateUpcomingRemindersForUser } = require('../utils/generateReminders');

// List notifications + generate 24h reminders on demand
router.get('/', verifyToken, async (req, res) => {
  try {
    await generateUpcomingRemindersForUser(req.user.userId);

    const filter = { user: req.user.userId };
    if (req.query.unreadOnly === '1') filter.read = false;

    const items = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(items);
  } catch (e) {
    console.error('notifications GET error:', e);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

router.patch('/:id/read', verifyToken, async (req, res) => {
  await Notification.updateOne(
    { _id: req.params.id, user: req.user.userId },
    { $set: { read: true } }
  );
  res.json({ ok: true });
});

router.patch('/read-all', verifyToken, async (req, res) => {
  await Notification.updateMany(
    { user: req.user.userId, read: false },
    { $set: { read: true } }
  );
  res.json({ ok: true });
});

module.exports = router;
