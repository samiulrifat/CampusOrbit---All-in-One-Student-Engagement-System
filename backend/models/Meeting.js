const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true, index: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    agenda: { type: String, default: '' },
    location: { type: String, default: '' },
    scheduledAt: { type: Date, required: true, index: true },
    invitationsSent: { type: Boolean, default: false },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meeting', meetingSchema);
