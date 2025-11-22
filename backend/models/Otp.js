const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otpHash: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['signup', 'login', 'forgot'], // ✅ added 'forgot'
    required: true 
  },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 }
});

// Automatically delete expired OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
