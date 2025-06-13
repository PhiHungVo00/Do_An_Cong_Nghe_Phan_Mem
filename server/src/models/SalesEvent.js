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
    enum: ['Khuyến mãi', 'Sự kiện', 'Họp', 'Khác'],
    default: 'Khuyến mãi'
  },
  status: {
    type: String,
    required: true,
    enum: ['Chưa bắt đầu', 'Đang diễn ra', 'Đã kết thúc', 'Đã hủy'],
    default: 'Chưa bắt đầu'
  },
  location: {
    type: String,
    trim: true
  },
  participants: [{
    type: String,
    trim: true
  }],
  budget: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalesEvent', salesEventSchema); 