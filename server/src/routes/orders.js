const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

// User routes (authentication required)
// Get user's own orders
router.get('/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.email })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng' });
  }
});

// Create order for user
router.post('/user', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Process items to include product information
    const processedItems = items.map(item => ({
      productId: item.productId,
      productName: item.productName || `Sản phẩm ${item.productId.slice(-6)}`,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '',
      brand: item.brand || '',
      sku: item.sku || ''
    }));

    const order = new Order({
      orderNumber,
      customer: req.user.email,
      date: new Date(),
      totalAmount,
      status: 'Đang xử lý',
      paymentStatus: 'Chờ thanh toán',
      shippingAddress,
      paymentMethod,
      items: processedItems
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating user order:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng mới' });
  }
});

// Get single order for user
router.get('/user/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      customer: req.user.email 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching user order:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin đơn hàng' });
  }
});

// Admin routes (admin authentication required)
// Get all orders with pagination
router.get('/', auth, adminAuth, async (req, res) => {
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

// Get single order for admin with product details
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin đơn hàng' });
  }
});

// Add new order (admin)
router.post('/', auth, adminAuth, async (req, res) => {
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
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { orderNumber, customer, date, totalAmount, status, paymentStatus, shippingAddress, items } = req.body;
    const orderId = req.params.id;

    // Check if order number exists for other orders
    const existingOrder = await Order.findOne({ orderNumber, _id: { $ne: orderId } });
    if (existingOrder) {
      return res.status(400).json({ message: 'Mã đơn hàng đã tồn tại trong hệ thống' });
    }

    const updateData = { orderNumber, customer, date, totalAmount, status, paymentStatus, shippingAddress };
    if (items) {
      updateData.items = items;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
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
router.delete('/:id', auth, adminAuth, async (req, res) => {
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
router.delete('/clear-all', auth, adminAuth, async (req, res) => {
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