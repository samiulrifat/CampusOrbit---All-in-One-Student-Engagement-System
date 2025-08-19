const mongoose = require('mongoose');

const sponsorshipRequestSchema = new mongoose.Schema({
  event:         { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  organizer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName:   { type: String, required: true },
  amount:        { type: Number, required: true },
  details:       { type: String },
  status:        { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  decisionBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  decisionNote:  { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SponsorshipRequest', sponsorshipRequestSchema);
