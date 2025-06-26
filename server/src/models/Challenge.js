const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image: { type: String, trim: true },
  reward: { type: String, trim: true },
  participants: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'upcoming', 'ended'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema); 