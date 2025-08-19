const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  date:        { type: Date,   required: true },
  location:    { type: String, default: '' },
  description: { type: String, default: '' },
  clubId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  attendees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  photos : { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
