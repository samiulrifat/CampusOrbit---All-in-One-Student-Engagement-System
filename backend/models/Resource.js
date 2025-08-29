// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);