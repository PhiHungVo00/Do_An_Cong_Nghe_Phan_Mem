const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'user'],
    default: 'user',
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Store settings
  storeName: {
    type: String,
    trim: true,
  },
  storeAddress: {
    type: String,
    trim: true,
  },
  storePhone: {
    type: String,
    trim: true,
  },
  storeEmail: {
    type: String,
    trim: true,
  },
  storeLogo: {
    type: String,
    trim: true,
  },
  // Notification settings
  notifyEmail: {
    type: Boolean,
    default: true,
  },
  notifyBrowser: {
    type: Boolean,
    default: false,
  },
  // Security settings
  enable2FA: {
    type: Boolean,
    default: false,
  },
  // Theme settings
  darkMode: {
    type: Boolean,
    default: false,
  },
  primaryColor: {
    type: String,
    default: '#1976d2',
  },
  // Preferences
  language: {
    type: String,
    default: 'vi',
  },
  timezone: {
    type: String,
    default: 'Asia/Ho_Chi_Minh',
  },
  // Payment settings
  bankName: {
    type: String,
    trim: true,
  },
  bankAccount: {
    type: String,
    trim: true,
  },
  accountHolder: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 