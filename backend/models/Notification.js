const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:    { type: String, enum: ['event-reminder','event-update','sponsorship'], required: true },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  link:    { type: String },
  read:    { type: Boolean, default: false },
  meta:    { type: Object },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 1000*60*60*24*30) }
}, { timestamps: true });

// TTL index to remove expired notifications automatically
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);