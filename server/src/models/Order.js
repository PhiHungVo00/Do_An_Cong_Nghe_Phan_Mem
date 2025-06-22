const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    default: ''
  }
});

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
    required: true,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Đang xử lý', 'Đã hoàn thành', 'Đã hủy', 'Đã gửi hàng', 'Đã giao hàng'],
    default: 'Đang xử lý'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Chờ thanh toán', 'Đã thanh toán', 'Đã hoàn tiền', 'Thanh toán thất bại'],
    default: 'Chờ thanh toán'
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true
  },
  items: [orderItemSchema]
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ orderNumber: 1, customer: 1, status: 1, date: -1 });

// Virtual for order status in Vietnamese
orderSchema.virtual('statusVi').get(function() {
  const statusMap = {
    'Đang xử lý': 'Đang xử lý',
    'Đã hoàn thành': 'Đã hoàn thành',
    'Đã hủy': 'Đã hủy',
    'Đã gửi hàng': 'Đã gửi hàng',
    'Đã giao hàng': 'Đã giao hàng'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment status in Vietnamese
orderSchema.virtual('paymentStatusVi').get(function() {
  const statusMap = {
    'Chờ thanh toán': 'Chờ thanh toán',
    'Đã thanh toán': 'Đã thanh toán',
    'Đã hoàn tiền': 'Đã hoàn tiền',
    'Thanh toán thất bại': 'Thanh toán thất bại'
  };
  return statusMap[this.paymentStatus] || this.paymentStatus;
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema); 