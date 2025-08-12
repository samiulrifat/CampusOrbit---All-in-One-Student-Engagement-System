const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // the club officer
  title: { type: String, required: true },
  agenda: { type: String },
  location: { type: String }, // physical address or online meeting link
  scheduledAt: { type: Date, required: true },
  invitationsSent: { type: Boolean, default: false },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who attended
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meeting', MeetingSchema);
