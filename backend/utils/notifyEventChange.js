const Notification = require('../models/Notification');
const Event = require('../models/Event');

async function notifyEventChange(eventId, changedFields = []) {
  const evt = await Event.findById(eventId).select('_id title attendees');
  if (!evt) return;

  const link = `/events/${evt._id}`;
  const what = changedFields.length ? changedFields.join(', ') : 'details';
  const msg  = `Update: "${evt.title}" ${what} changed.`;

  const ops = evt.attendees.map(uid => ({
    updateOne: {
      filter: { user: uid, type: 'event-update', 'meta.eventId': evt._id },
      update: {
        $set: {
          user: uid, type: 'event-update',
          title: 'Event Updated', message: msg, link,
          meta: { eventId: evt._id, fields: changedFields }
        },
        $setOnInsert: { read: false }
      },
      upsert: true
    }
  }));

  if (ops.length) await Notification.bulkWrite(ops);
}

module.exports = { notifyEventChange };
