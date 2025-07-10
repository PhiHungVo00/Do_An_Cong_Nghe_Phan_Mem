const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { auth, adminAuth } = require('../middleware/auth');

// Get sales analytics data
router.get('/sales', auth, adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate, endDate;

    // Tính toán khoảng thời gian
    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    } else {
      // Default to last 6 months
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      endDate = now;
    }

    // Lấy dữ liệu doanh số theo thời gian
    const salesData = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Format data for chart
    const labels = [];
    const revenueData = [];
    const orderData = [];

    salesData.forEach(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      labels.push(date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }));
      revenueData.push(item.totalRevenue);
      orderData.push(item.orderCount);
    });

    res.json({
      labels,
      revenue: revenueData,
      orders: orderData,
      totalRevenue: revenueData.reduce((sum, val) => sum + val, 0),
      totalOrders: orderData.reduce((sum, val) => sum + val, 0)
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu phân tích doanh số' });
  }
});

// Get traffic analytics data
router.get('/traffic', auth, adminAuth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const now = new Date();
    let startDate;

    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    }

    // Mock traffic data (có thể thay thế bằng dữ liệu thực từ analytics service)
    const trafficData = {
      labels: ['Google', 'Direct', 'Social Media', 'Referral'],
      datasets: [
        {
          label: 'Traffic',
          data: [35, 25, 25, 15],
          backgroundColor: ['#6C63FF', '#FFB300', '#00BFA6', '#FF6B6B']
        }
      ]
    };

    res.json(trafficData);
  } catch (error) {
    console.error('Error fetching traffic analytics:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu phân tích lưu lượng' });
  }
});

// Get dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Tính toán doanh thu
    const currentRevenue = await Order.aggregate([
      {
        $match: {
          date: { $gte: currentMonth },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          date: { $gte: lastMonth, $lt: currentMonth },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const currentRevenueValue = currentRevenue[0]?.total || 0;
    const lastMonthRevenueValue = lastMonthRevenue[0]?.total || 0;
    const revenueChange = lastMonthRevenueValue > 0 ? 
      ((currentRevenueValue - lastMonthRevenueValue) / lastMonthRevenueValue) * 100 : 0;

    // Tính toán đơn hàng
    const currentOrders = await Order.countDocuments({
      date: { $gte: currentMonth },
      status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
    });

    const lastMonthOrders = await Order.countDocuments({
      date: { $gte: lastMonth, $lt: currentMonth },
      status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
    });

    const orderChange = lastMonthOrders > 0 ? 
      ((currentOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0;

    // Tính toán khách hàng
    const currentCustomers = await Customer.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    const lastMonthCustomers = await Customer.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentMonth }
    });

    const customerChange = lastMonthCustomers > 0 ? 
      ((currentCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 0;

    // Tính toán sản phẩm
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lastMonthProducts = await Product.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentMonth },
      isActive: true
    });

    const productChange = lastMonthProducts > 0 ? 
      ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100 : 0;

    // Mock traffic data
    const currentTraffic = 611;
    const lastMonthTraffic = 584;
    const trafficChange = ((currentTraffic - lastMonthTraffic) / lastMonthTraffic) * 100;

    res.json({
      revenue: {
        current: currentRevenueValue,
        change: revenueChange,
        changeAmount: currentRevenueValue - lastMonthRevenueValue
      },
      traffic: {
        current: currentTraffic,
        change: trafficChange,
        changeAmount: currentTraffic - lastMonthTraffic
      },
      orders: {
        current: currentOrders,
        change: orderChange,
        changeAmount: currentOrders - lastMonthOrders
      },
      products: {
        current: totalProducts,
        change: productChange,
        changeAmount: totalProducts - lastMonthProducts
      },
      customers: {
        current: currentCustomers,
        change: customerChange,
        changeAmount: currentCustomers - lastMonthCustomers
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê dashboard' });
  }
});

// Get top selling products
router.get('/top-selling', auth, adminAuth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const topProducts = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(parseInt(limit))
      .select('name soldCount price image');

    res.json(topProducts);
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm bán chạy' });
  }
});

// Get recent orders
router.get('/recent-orders', auth, adminAuth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('orderNumber customer totalAmount status date');

    res.json(recentOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng gần đây' });
  }
});

// Get customer analytics
router.get('/customers', auth, adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Khách hàng mới
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    const lastMonthNewCustomers = await Customer.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentMonth }
    });

    // Khách hàng VIP
    const vipCustomers = await Customer.countDocuments({
      totalPurchases: { $gt: 5 },
      isActive: true
    });

    // Khách hàng không hoạt động
    const inactiveDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const inactiveCustomers = await Customer.countDocuments({
      lastPurchaseDate: { $lt: inactiveDate },
      isActive: true
    });

    res.json({
      newCustomers: {
        current: newCustomers,
        change: lastMonthNewCustomers > 0 ? 
          ((newCustomers - lastMonthNewCustomers) / lastMonthNewCustomers) * 100 : 0
      },
      vipCustomers,
      inactiveCustomers,
      totalCustomers: await Customer.countDocuments()
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy phân tích khách hàng' });
  }
});

// Get revenue details analytics
router.get('/revenue-details', auth, adminAuth, async (req, res) => {
  try {
    const { period = 'year' } = req.query;
    const now = new Date();
    let startDate, endDate;

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (period === 'quarter') {
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1);
      endDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0);
    } else {
      // Default to year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    // Get monthly revenue data
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$date' } },
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Get top products by revenue
    const topProducts = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.productName',
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Calculate current month stats
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthRevenue = await Order.aggregate([
      {
        $match: {
          date: { $gte: currentMonth },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          date: { $gte: lastMonth, $lt: currentMonth },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const currentRevenue = currentMonthRevenue[0]?.totalRevenue || 0;
    const lastRevenue = lastMonthRevenue[0]?.totalRevenue || 0;
    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
    const avgOrderValue = currentMonthRevenue[0]?.orderCount > 0 ? 
      currentRevenue / currentMonthRevenue[0].orderCount : 0;

    // Format monthly data
    const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const revenueData = new Array(12).fill(0);
    
    monthlyRevenue.forEach(item => {
      revenueData[item._id.month - 1] = item.totalRevenue;
    });

    res.json({
      monthlyData: {
        labels,
        datasets: [{
          label: 'Doanh thu (triệu VNĐ)',
          data: revenueData.map(val => val / 1000000), // Convert to millions
          borderColor: '#6C63FF',
          backgroundColor: 'rgba(108, 99, 255, 0.1)',
          fill: true,
        }]
      },
      topProducts,
      stats: {
        currentMonthRevenue,
        revenueChange,
        orderCount: currentMonthRevenue[0]?.orderCount || 0,
        avgOrderValue
      }
    });
  } catch (error) {
    console.error('Error fetching revenue details:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết doanh thu' });
  }
});

// Get access details analytics
router.get('/access-details', auth, adminAuth, async (req, res) => {
  try {
    // Mock data for access analytics (có thể tích hợp với Google Analytics thực)
    const dailyAccessData = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
      datasets: [{
        label: 'Lượt truy cập',
        data: [45, 52, 38, 41, 56, 48, 54, 42, 47, 38, 42, 44, 46, 49, 53],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
      }]
    };

    const deviceAccessData = {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        label: 'Lượt truy cập theo thiết bị',
        data: [320, 250, 41],
        backgroundColor: [
          'rgba(108, 99, 255, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      }]
    };

    const accessStats = [
      { label: 'Tổng lượt truy cập', value: '611' },
      { label: 'Trung bình/ngày', value: '45' },
      { label: 'Thời gian TB/phiên', value: '5m 32s' },
      { label: 'Tỷ lệ thoát', value: '35.8%' },
    ];

    const pageStats = [
      { page: 'Trang chủ', views: 245 },
      { page: 'Sản phẩm', views: 189 },
      { page: 'Giỏ hàng', views: 132 },
      { page: 'Thanh toán', views: 98 },
      { page: 'Tài khoản', views: 76 },
    ];

    res.json({
      dailyAccessData,
      deviceAccessData,
      accessStats,
      pageStats
    });
  } catch (error) {
    console.error('Error fetching access details:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết truy cập' });
  }
});

// Get transaction details analytics
router.get('/transaction-details', auth, adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    // Get daily transaction data
    const dailyTransactions = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate },
          status: { $in: ['Đã giao hàng', 'Đã hoàn thành', 'Đang xử lý', 'Đã hủy'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $limit: 15
      }
    ]);

    // Get recent transactions
    const recentTransactions = await Order.find()
      .sort({ date: -1 })
      .limit(10)
      .select('orderNumber date customer totalAmount status items');

    // Calculate transaction stats
    const totalTransactions = await Order.countDocuments({
      date: { $gte: startDate }
    });

    const completedTransactions = await Order.countDocuments({
      date: { $gte: startDate },
      status: { $in: ['Đã giao hàng', 'Đã hoàn thành'] }
    });

    const pendingTransactions = await Order.countDocuments({
      date: { $gte: startDate },
      status: 'Đang xử lý'
    });

    const cancelledTransactions = await Order.countDocuments({
      date: { $gte: startDate },
      status: 'Đã hủy'
    });

    // Format transaction data
    const labels = dailyTransactions.map(item => {
      const date = new Date(item._id);
      return date.getDate().toString();
    });

    const transactionData = {
      labels,
      datasets: [{
        label: 'Số giao dịch',
        data: dailyTransactions.map(item => item.count),
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
      }]
    };

    const stats = [
      { label: 'Tổng giao dịch', value: totalTransactions.toString() },
      { label: 'Giao dịch thành công', value: completedTransactions.toString() },
      { label: 'Đang xử lý', value: pendingTransactions.toString() },
      { label: 'Đã hủy', value: cancelledTransactions.toString() },
    ];

    res.json({
      transactionData,
      recentTransactions,
      stats
    });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết giao dịch' });
  }
});

// Get top selling products with detailed analytics
router.get('/top-selling-products', auth, adminAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get products with their sales data
    const topProducts = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$productId', '$items.productId'] },
                    { $in: ['$status', ['Đã giao hàng', 'Đã hoàn thành']] }
                  ]
                }
              }
            }
          ],
          as: 'orders'
        }
      },
      {
        $addFields: {
          soldCount: { $sum: '$soldCount' },
          revenue: { $multiply: ['$price', '$soldCount'] },
          lastSoldDate: {
            $max: {
              $map: {
                input: '$orders',
                as: 'order',
                in: '$$order.date'
              }
            }
          }
        }
      },
      {
        $sort: { soldCount: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          soldCount: 1,
          revenue: 1,
          image: 1,
          status: { $cond: [{ $gt: ['$stock', 0] }, 'In Stock', 'Out of Stock'] },
          lastSoldDate: 1
        }
      }
    ]);

    res.json(topProducts);
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm bán chạy' });
  }
});

module.exports = router; 