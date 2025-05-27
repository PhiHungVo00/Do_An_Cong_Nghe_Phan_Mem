const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['retail', 'wholesale'],
    default: 'retail',
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  lastPurchaseDate: {
    type: Date,
  },
  totalPurchases: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster queries
customerSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Customer', customerSchema); 