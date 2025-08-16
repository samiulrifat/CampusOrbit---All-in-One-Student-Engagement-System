const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  date:        { type: Date,   required: true },
  location:    { type: String, default: '' },
  description: { type: String, default: '' },
  attendees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
