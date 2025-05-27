const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerAvatar: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  reply: {
    type: String,
    default: ''
  },
  repliedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Review', ReviewSchema); 