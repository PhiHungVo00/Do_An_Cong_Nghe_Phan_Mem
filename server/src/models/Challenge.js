const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  shortDescription: { 
    type: String, 
    trim: true 
  },
  image: { 
    type: String, 
    trim: true 
  },
  bannerImage: { 
    type: String, 
    trim: true 
  },
  reward: { 
    type: String, 
    required: true,
    trim: true 
  },
  participants: [{ 
    type: String, 
    trim: true 
  }],
  maxParticipants: { 
    type: Number, 
    min: 0 
  },
  requirements: { 
    type: String, 
    required: true,
    trim: true 
  },
  rules: { 
    type: String, 
    required: true,
    trim: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  type: {
    type: String,
    required: true,
    enum: ['shopping', 'social', 'creative', 'other'],
    default: 'shopping'
  },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive', 'cancelled'], 
    default: 'draft' 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
challengeSchema.index({ status: 1, startDate: 1, endDate: 1, type: 1 });

// Virtual for challenge status in Vietnamese
challengeSchema.virtual('statusVi').get(function() {
  const statusMap = {
    'draft': 'Chưa bắt đầu',
    'active': 'Đang diễn ra',
    'inactive': 'Đã kết thúc',
    'cancelled': 'Đã hủy'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for challenge type in Vietnamese
challengeSchema.virtual('typeVi').get(function() {
  const typeMap = {
    'shopping': 'Mua sắm',
    'social': 'Mạng xã hội',
    'creative': 'Sáng tạo',
    'other': 'Khác'
  };
  return typeMap[this.type] || this.type;
});

// Virtual to check if challenge is currently active
challengeSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.startDate <= now && 
         this.endDate >= now;
});

// Ensure virtual fields are serialized
challengeSchema.set('toJSON', { virtuals: true });
challengeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Challenge', challengeSchema); 