const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customer: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Đã hoàn thành', 'Đang xử lý', 'Đã hủy'],
    default: 'Đang xử lý'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Đã thanh toán', 'Chờ thanh toán', 'Đã hoàn tiền'],
    default: 'Chờ thanh toán'
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 