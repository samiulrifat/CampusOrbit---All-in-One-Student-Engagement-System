const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  title: { type: String, required: true },
  description: String,
  iconUrl: String,          // icon/image of the badge
  criteria: String,         // textual description of how to earn it
  createdAt: { type: Date, default: Date.now }
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
