const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const { updateProductInventory } = require('../services/productUpdateService');
const { autoAddCustomerFromOrder, updateCustomerFromOrderStatus } = require('../services/customerAutoService');

// Middleware xác thực shipper (giả sử role='shipper')
const shipperAuth = async (req, res, next) => {
  if (!req.user || req.user.role !== 'shipper') {
    return res.status(403).json({ message: 'Chỉ dành cho shipper' });
  }
  next();
};

// User routes (authentication required)
// Get user's own orders
router.get('/user', auth, async (req, res) => {
  try {
    // Luôn lấy trạng thái mới nhất từ DB
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
    
    // Cập nhật thông tin sản phẩm khi tạo đơn hàng mới
    try {
      await updateProductInventory(processedItems, 'Đang xử lý');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin sản phẩm:', error);
      // Không throw error để không ảnh hưởng đến việc tạo đơn hàng
    }

    // Tự động thêm/cập nhật khách hàng khi tạo đơn hàng mới
    try {
      await autoAddCustomerFromOrder(order, req.user.email);
    } catch (error) {
      console.error('Lỗi khi tự động thêm/cập nhật khách hàng:', error);
      // Không throw error để không ảnh hưởng đến việc tạo đơn hàng
    }
    
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

    // Luôn lấy trạng thái mới nhất từ DB
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
    let { orderNumber, customer, date, totalAmount, status, paymentStatus, shippingAddress, items } = req.body;
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

    // Nếu admin xác nhận đơn hàng, tự động chuyển sang 'Chờ nhận giao'
    if (status === 'Đã hoàn thành' || status === 'Đã xác nhận' || status === 'Đã gửi hàng') {
      updateData.status = 'Chờ nhận giao';
      updateData.shipper = null;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật thông tin khách hàng khi thay đổi trạng thái đơn hàng
    try {
      await updateCustomerFromOrderStatus(order, status);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin khách hàng:', error);
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

// Clear all orders (admin only)
router.delete('/', auth, adminAuth, async (req, res) => {
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

// Shipper routes
// 1. Lấy danh sách đơn 'Chờ nhận giao'
router.get('/shipper/available', auth, shipperAuth, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Chờ nhận giao' }).sort({ createdAt: -1 });
    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      customer: {
        name: order.customer.split('|')[0] || '',
        phone: order.customer.split('|')[1] || '',
        address: order.shippingAddress || ''
      },
      items: order.items.map(item => ({
        name: item.productName,
        price: item.price,
        quantity: item.quantity
      })),
      createdAt: order.createdAt || order.date || null
    }));
    res.json({ orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy đơn chờ nhận giao' });
  }
});

// 2. Lấy danh sách đơn shipper đang giao hoặc đã giao
router.get('/shipper/assigned', auth, shipperAuth, async (req, res) => {
  try {
    const orders = await Order.find({ 
      shipper: req.user.email, 
      status: { $in: ['Đang giao hàng', 'Đã giao hàng', 'Đã hoàn thành'] } 
    }).sort({ createdAt: -1 });
    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      customer: {
        name: order.customer.split('|')[0] || '',
        phone: order.customer.split('|')[1] || '',
        address: order.shippingAddress || ''
      },
      items: order.items.map(item => ({
        name: item.productName,
        price: item.price,
        quantity: item.quantity
      })),
      createdAt: order.createdAt || order.date || null
    }));
    res.json({ orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy đơn của shipper' });
  }
});

// 3. Shipper nhận đơn
router.post('/shipper/accept/:id', auth, shipperAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      status: 'Chờ nhận giao', 
      shipper: null 
    });
    if (!order) {
      return res.status(404).json({ message: 'Đơn không hợp lệ hoặc đã có shipper khác nhận' });
    }
    order.shipper = req.user.email;
    order.status = 'Đang giao hàng';
    await order.save();
    res.json({ message: 'Nhận đơn thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi nhận đơn' });
  }
});

// 4. Shipper từ chối đơn
router.post('/shipper/reject/:id', auth, shipperAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      shipper: req.user.email, 
      status: 'Đang giao hàng' 
    });
    if (!order) {
      return res.status(404).json({ message: 'Đơn không hợp lệ hoặc không thuộc quyền shipper' });
    }
    order.shipper = null;
    order.status = 'Chờ nhận giao';
    await order.save();
    res.json({ message: 'Đã từ chối đơn, đơn quay lại trạng thái chờ nhận giao', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi từ chối đơn' });
  }
});

// 5. Shipper xác nhận đã giao hàng
router.post('/shipper/delivered/:id', auth, shipperAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      shipper: req.user.email, 
      status: 'Đang giao hàng' 
    });
    if (!order) {
      return res.status(404).json({ message: 'Đơn không hợp lệ hoặc không thuộc quyền shipper' });
    }
    order.status = 'Đã giao hàng';
    order.deliveryStatus = 'delivered';
    order.deliveredAt = new Date();
    if (order.paymentMethod === 'COD') {
      order.paymentStatus = 'Đã thanh toán';
    }
    await order.save();
    res.json({ message: 'Đã xác nhận giao hàng thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xác nhận giao hàng' });
  }
});

// 6. Shipper cập nhật trạng thái giao hàng
router.put('/shipper/status/:id', auth, shipperAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ 
      _id: req.params.id, 
      shipper: req.user.email 
    });
    if (!order) {
      return res.status(404).json({ message: 'Đơn không hợp lệ hoặc không thuộc quyền shipper' });
    }
    // Nếu là trạng thái chi tiết, cập nhật deliveryStatus
    if (['picked_up', 'in_transit', 'delivered'].includes(status)) {
      order.deliveryStatus = status;
      // Nếu là delivered, cập nhật luôn status tổng thể
      if (status === 'delivered') {
        order.status = 'Đã giao hàng';
      }
    } else {
      order.status = status;
    }
    await order.save();
    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái' });
  }
});

// 7. Lấy danh sách đơn đã giao
router.get('/shipper/delivered', auth, shipperAuth, async (req, res) => {
  try {
    const orders = await Order.find({ 
      shipper: req.user.email, 
      status: 'Đã giao hàng' 
    }).sort({ createdAt: -1 });
    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      customer: {
        name: order.customer.split('|')[0] || '',
        phone: order.customer.split('|')[1] || '',
        address: order.shippingAddress || ''
      },
      items: order.items.map(item => ({
        name: item.productName,
        price: item.price,
        quantity: item.quantity
      })),
      createdAt: order.createdAt || order.date || null,
      deliveredAt: order.deliveredAt || null
    }));
    res.json({ orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy đơn đã giao' });
  }
});

module.exports = router; 