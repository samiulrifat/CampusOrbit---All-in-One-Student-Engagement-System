const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
  clubId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club', 
    required: true 
  },
  creatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  question: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  isOpen: { type: Boolean, default: true }
});

module.exports = mongoose.model('Poll', PollSchema);