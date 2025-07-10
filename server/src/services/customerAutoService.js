const Customer = require('../models/Customer');
const Order = require('../models/Order');
const User = require('../models/User');

/**
 * Tự động thêm hoặc cập nhật khách hàng khi có đơn hàng mới
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @param {string} userEmail - Email của user đặt hàng
 * @returns {Object} Thông tin khách hàng
 */
const autoAddCustomerFromOrder = async (orderData, userEmail) => {
  try {
    // Kiểm tra xem khách hàng đã tồn tại chưa
    let customer = await Customer.findOne({ email: userEmail });

    if (customer) {
      // Cập nhật thông tin khách hàng hiện có
      const updateData = {
        lastPurchaseDate: new Date(),
        totalPurchases: (customer.totalPurchases || 0) + 1,
        isActive: true
      };

      // Cập nhật địa chỉ nếu khác
      if (orderData.shippingAddress && orderData.shippingAddress !== customer.address) {
        updateData.address = orderData.shippingAddress;
      }

      customer = await Customer.findByIdAndUpdate(
        customer._id,
        updateData,
        { new: true, runValidators: true }
      );

      console.log(`Đã cập nhật khách hàng hiện có: ${customer.name}`);
    } else {
      // Tạo khách hàng mới
      const user = await User.findOne({ email: userEmail });
      
      if (!user) {
        throw new Error('Không tìm thấy thông tin user');
      }

      const newCustomerData = {
        name: user.name || userEmail.split('@')[0], // Sử dụng tên user hoặc email prefix
        email: userEmail,
        phone: user.phone || 'Chưa cập nhật',
        address: orderData.shippingAddress || 'Chưa cập nhật',
        type: 'retail', // Mặc định là khách lẻ
        lastPurchaseDate: new Date(),
        totalPurchases: 1,
        isActive: true,
        notes: `Tự động tạo từ đơn hàng ${orderData.orderNumber}`
      };

      customer = new Customer(newCustomerData);
      await customer.save();

      console.log(`Đã tạo khách hàng mới: ${customer.name}`);
    }

    return customer;
  } catch (error) {
    console.error('Lỗi khi tự động thêm/cập nhật khách hàng:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin khách hàng khi đơn hàng thay đổi trạng thái
 * @param {string} orderId - ID đơn hàng
 * @param {string} newStatus - Trạng thái mới
 */
const updateCustomerFromOrderStatus = async (orderId, newStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.warn(`Không tìm thấy đơn hàng: ${orderId}`);
      return;
    }

    const customer = await Customer.findOne({ email: order.customer });
    if (!customer) {
      console.warn(`Không tìm thấy khách hàng: ${order.customer}`);
      return;
    }

    const updateData = {};

    // Cập nhật ngày mua hàng cuối nếu đơn hàng hoàn thành
    if (newStatus === 'Đã giao hàng' || newStatus === 'Đã hoàn thành') {
      updateData.lastPurchaseDate = new Date();
    }

    // Cập nhật ghi chú
    updateData.notes = `${updateData.notes || customer.notes || ''}\nCập nhật trạng thái đơn hàng ${order.orderNumber}: ${newStatus}`;

    if (Object.keys(updateData).length > 0) {
      await Customer.findByIdAndUpdate(
        customer._id,
        updateData,
        { new: true, runValidators: true }
      );

      console.log(`Đã cập nhật khách hàng ${customer.name} từ trạng thái đơn hàng`);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng từ trạng thái đơn hàng:', error);
  }
};

/**
 * Lấy thống kê khách hàng
 * @returns {Object} Thống kê khách hàng
 */
const getCustomerStats = async () => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ isActive: true });
    const newCustomersThisMonth = await Customer.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });
    const customersWithOrders = await Customer.countDocuments({
      totalPurchases: { $gt: 0 }
    });

    return {
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      customersWithOrders,
      inactiveCustomers: totalCustomers - activeCustomers
    };
  } catch (error) {
    console.error('Lỗi khi lấy thống kê khách hàng:', error);
    throw error;
  }
};

/**
 * Lấy danh sách khách hàng VIP (mua nhiều)
 * @param {number} limit - Số lượng khách hàng
 * @returns {Array} Danh sách khách hàng VIP
 */
const getVIPCustomers = async (limit = 10) => {
  try {
    const vipCustomers = await Customer.find({
      totalPurchases: { $gt: 0 },
      isActive: true
    })
    .sort({ totalPurchases: -1, lastPurchaseDate: -1 })
    .limit(limit);

    return vipCustomers;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng VIP:', error);
    throw error;
  }
};

/**
 * Lấy danh sách khách hàng mới
 * @param {number} limit - Số lượng khách hàng
 * @returns {Array} Danh sách khách hàng mới
 */
const getNewCustomers = async (limit = 10) => {
  try {
    const newCustomers = await Customer.find({
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(limit);

    return newCustomers;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng mới:', error);
    throw error;
  }
};

/**
 * Lấy danh sách khách hàng không hoạt động
 * @param {number} days - Số ngày không mua hàng
 * @returns {Array} Danh sách khách hàng không hoạt động
 */
const getInactiveCustomers = async (days = 30) => {
  try {
    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - days);

    const inactiveCustomers = await Customer.find({
      lastPurchaseDate: { $lt: inactiveDate },
      isActive: true
    }).sort({ lastPurchaseDate: 1 });

    return inactiveCustomers;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng không hoạt động:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin khách hàng từ user profile
 * @param {string} userEmail - Email của user
 * @param {Object} userData - Dữ liệu user mới
 */
const updateCustomerFromUserProfile = async (userEmail, userData) => {
  try {
    const customer = await Customer.findOne({ email: userEmail });
    if (!customer) {
      console.warn(`Không tìm thấy khách hàng với email: ${userEmail}`);
      return;
    }

    const updateData = {};

    if (userData.name && userData.name !== customer.name) {
      updateData.name = userData.name;
    }

    if (userData.phone && userData.phone !== customer.phone) {
      updateData.phone = userData.phone;
    }

    if (userData.address && userData.address !== customer.address) {
      updateData.address = userData.address;
    }

    if (Object.keys(updateData).length > 0) {
      await Customer.findByIdAndUpdate(
        customer._id,
        updateData,
        { new: true, runValidators: true }
      );

      console.log(`Đã cập nhật thông tin khách hàng ${customer.name} từ user profile`);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng từ user profile:', error);
  }
};

module.exports = {
  autoAddCustomerFromOrder,
  updateCustomerFromOrderStatus,
  getCustomerStats,
  getVIPCustomers,
  getNewCustomers,
  getInactiveCustomers,
  updateCustomerFromUserProfile
}; 