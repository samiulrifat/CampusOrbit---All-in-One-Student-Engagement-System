const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { 
    type: String, 
    enum: ['member', 'officer', 'admin'], 
    default: 'member' 
  },
  joinedAt: { type: Date, default: Date.now }
});

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  profileImage: { type: String, default: '' }, // URL or filename in uploads
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  invitations: [
    {
      email: { type: String, required: true },
      invitedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
