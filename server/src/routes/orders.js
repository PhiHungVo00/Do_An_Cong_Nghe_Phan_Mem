const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Get all orders with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments();

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng' });
  }
});

// Add new order
router.post('/', auth, async (req, res) => {
  try {
    const { orderNumber, customer, date, totalAmount, status, paymentStatus, shippingAddress } = req.body;

    // Check if order number already exists
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
      return res.status(400).json({ message: 'Mã đơn hàng đã tồn tại trong hệ thống' });
    }

    const order = new Order({
      orderNumber,
      customer,
      date,
      totalAmount,
      status,
      paymentStatus,
      shippingAddress
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng mới' });
  }
});

// Update order
router.put('/:id', auth, async (req, res) => {
  try {
    const { orderNumber, customer, date, totalAmount, status, paymentStatus, shippingAddress } = req.body;
    const orderId = req.params.id;

    // Check if order number exists for other orders
    const existingOrder = await Order.findOne({ orderNumber, _id: { $ne: orderId } });
    if (existingOrder) {
      return res.status(400).json({ message: 'Mã đơn hàng đã tồn tại trong hệ thống' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderNumber, customer, date, totalAmount, status, paymentStatus, shippingAddress },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật đơn hàng' });
  }
});

// Delete order
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ message: 'Đã xóa đơn hàng thành công' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa đơn hàng' });
  }
});

// Clear all orders
router.delete('/clear-all', auth, async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    res.json({ 
      message: 'Đã xóa tất cả đơn hàng thành công',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error clearing orders:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa tất cả đơn hàng' });
  }
});

module.exports = router; 