const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { auth, adminAuth } = require('../middleware/auth');
const { 
  getCustomerStats, 
  getVIPCustomers, 
  getNewCustomers, 
  getInactiveCustomers 
} = require('../services/customerAutoService');

// Get all customers with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCustomers = await Customer.countDocuments();

    res.json({
      customers,
      currentPage: page,
      totalPages: Math.ceil(totalCustomers / limit),
      totalCustomers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng' });
  }
});

// Add new customer
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
    }

    const customer = new Customer({
      name,
      email,
      phone,
      address
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo khách hàng mới' });
  }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customerId = req.params.id;

    // Check if email exists for other customers
    const existingCustomer = await Customer.findOne({ email, _id: { $ne: customerId } });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật khách hàng' });
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    res.json({ message: 'Đã xóa khách hàng thành công' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa khách hàng' });
  }
});

// Get customer statistics (admin only)
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = await getCustomerStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê khách hàng' });
  }
});

// Get VIP customers (admin only)
router.get('/vip', auth, adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const vipCustomers = await getVIPCustomers(limit);
    res.json(vipCustomers);
  } catch (error) {
    console.error('Error fetching VIP customers:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng VIP' });
  }
});

// Get new customers (admin only)
router.get('/new', auth, adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const newCustomers = await getNewCustomers(limit);
    res.json(newCustomers);
  } catch (error) {
    console.error('Error fetching new customers:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng mới' });
  }
});

// Get inactive customers (admin only)
router.get('/inactive', auth, adminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const inactiveCustomers = await getInactiveCustomers(days);
    res.json(inactiveCustomers);
  } catch (error) {
    console.error('Error fetching inactive customers:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng không hoạt động' });
  }
});

// Clear all customers
router.delete('/clear-all', auth, async (req, res) => {
  try {
    const result = await Customer.deleteMany({});
    res.json({ 
      message: 'Đã xóa tất cả khách hàng thành công',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error clearing customers:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa tất cả khách hàng' });
  }
});

// Get current user's customer profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Tìm theo userId nếu có, hoặc theo email
    let customer = await Customer.findOne({ userId: req.user.id });
    if (!customer && req.user.email) {
      customer = await Customer.findOne({ email: req.user.email });
    }
    if (!customer) {
      // Nếu chưa có profile, trả về thông tin cơ bản từ user
      return res.json({
        name: req.user.fullName || req.user.username || '',
        email: req.user.email || '',
        phone: req.user.phone || '',
        address: '',
        isGuest: true
      });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin khách hàng' });
  }
});

module.exports = router; 