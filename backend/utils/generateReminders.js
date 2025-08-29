const Notification = require('../models/Notification');
const Event = require('../models/Event');

async function generateUpcomingRemindersForUser(userId) {
  const now = new Date();
  const in24h = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const events = await Event.find({
    date: { $gte: now, $lte: in24h },
    attendees: userId
  }).select('_id title date');

  for (const evt of events) {
    const msg = `Reminder: "${evt.title}" starts ${new Date(evt.date).toLocaleString()}`;
    const link = `/events/${evt._id}`;

    await Notification.findOneAndUpdate(
      { user: userId, type: 'event-reminder', 'meta.eventId': evt._id },
      {
        $set: {
          user: userId, type: 'event-reminder',
          title: 'Event Reminder', message: msg, link,
          meta: { eventId: evt._id }
        },
        $setOnInsert: { read: false }
      },
      { upsert: true, new: true }
    );
  }
}

module.exports = { generateUpcomingRemindersForUser };