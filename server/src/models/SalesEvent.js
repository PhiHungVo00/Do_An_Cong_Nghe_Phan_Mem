const mongoose = require('mongoose');

const salesEventSchema = new mongoose.Schema({
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
    enum: ['promotion', 'event', 'meeting', 'other'],
    default: 'promotion'
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'active', 'inactive', 'cancelled'],
    default: 'draft'
  },
  location: {
    type: String,
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
  budget: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
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
salesEventSchema.index({ status: 1, startDate: 1, endDate: 1, type: 1 });

// Virtual for event status in Vietnamese
salesEventSchema.virtual('statusVi').get(function() {
  const statusMap = {
    'draft': 'Nháp',
    'active': 'Đang diễn ra',
    'inactive': 'Đã kết thúc',
    'cancelled': 'Đã hủy'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for event type in Vietnamese
salesEventSchema.virtual('typeVi').get(function() {
  const typeMap = {
    'promotion': 'Khuyến mãi',
    'event': 'Sự kiện',
    'meeting': 'Họp',
    'other': 'Khác'
  };
  return typeMap[this.type] || this.type;
});

// Virtual to check if event is currently active
salesEventSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.startDate <= now && 
         this.endDate >= now;
});

// Ensure virtual fields are serialized
salesEventSchema.set('toJSON', { virtuals: true });
salesEventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SalesEvent', salesEventSchema); 