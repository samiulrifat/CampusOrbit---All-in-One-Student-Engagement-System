// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['file', 'link'], required: true },
  title: { type: String, required: true },
  url: { type: String },        // For links or file storage URL
  fileName: { type: String },   // Optional, for uploaded files original name
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', resourceSchema);
