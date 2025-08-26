const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'clubAdmin', 'superAdmin'], default: 'student' },
  
  // Add this field:
  clubsJoined: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }
  ]
}, { timestamps: true });

// compare password method
UserSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
