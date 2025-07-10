const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const User = require('../models/User');
const { 
  autoAddCustomerFromOrder, 
  getCustomerStats, 
  getVIPCustomers,
  getNewCustomers,
  getInactiveCustomers 
} = require('../services/customerAutoService');
require('dotenv').config();

const testCustomerAuto = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Lấy thống kê ban đầu
    console.log('\n=== THỐNG KÊ KHÁCH HÀNG BAN ĐẦU ===');
    const initialStats = await getCustomerStats();
    console.log('Tổng khách hàng:', initialStats.totalCustomers);
    console.log('Đang hoạt động:', initialStats.activeCustomers);
    console.log('Mới tháng này:', initialStats.newCustomersThisMonth);
    console.log('Có đơn hàng:', initialStats.customersWithOrders);

    // Lấy một user để test
    const testUser = await User.findOne();
    if (!testUser) {
      console.log('Không có user nào để test. Vui lòng tạo user trước.');
      return;
    }

    console.log(`\n=== TEST VỚI USER: ${testUser.email} ===`);

    // Test 1: Tạo đơn hàng mới cho khách hàng mới
    console.log('\n=== TEST 1: TẠO ĐƠN HÀNG CHO KHÁCH HÀNG MỚI ===');
    
    const testOrderData = {
      orderNumber: `TEST-${Date.now()}`,
      customer: testUser.email,
      date: new Date(),
      totalAmount: 1500000,
      status: 'Đang xử lý',
      paymentStatus: 'Chờ thanh toán',
      paymentMethod: 'Thanh toán khi nhận hàng',
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
      items: [
        {
          productId: 'test-product-1',
          productName: 'Sản phẩm test',
          price: 750000,
          quantity: 2,
          image: '/assets/products/test.jpg',
          brand: 'Test Brand',
          sku: 'TEST-001'
        }
      ]
    };

    console.log('Trước khi tạo đơn hàng:');
    let customer = await Customer.findOne({ email: testUser.email });
    if (customer) {
      console.log(`- Khách hàng hiện có: ${customer.name}, Đơn hàng: ${customer.totalPurchases}`);
    } else {
      console.log('- Chưa có khách hàng với email này');
    }

    // Tự động thêm khách hàng
    customer = await autoAddCustomerFromOrder(testOrderData, testUser.email);
    console.log(`Sau khi tạo đơn hàng: ${customer.name}, Đơn hàng: ${customer.totalPurchases}`);

    // Test 2: Tạo đơn hàng thứ 2 cho cùng khách hàng
    console.log('\n=== TEST 2: TẠO ĐƠN HÀNG THỨ 2 CHO CÙNG KHÁCH HÀNG ===');
    
    const testOrderData2 = {
      orderNumber: `TEST-${Date.now()}-2`,
      customer: testUser.email,
      date: new Date(),
      totalAmount: 2000000,
      status: 'Đang xử lý',
      paymentStatus: 'Chờ thanh toán',
      paymentMethod: 'Thanh toán khi nhận hàng',
      shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM', // Địa chỉ khác
      items: [
        {
          productId: 'test-product-2',
          productName: 'Sản phẩm test 2',
          price: 1000000,
          quantity: 2,
          image: '/assets/products/test2.jpg',
          brand: 'Test Brand 2',
          sku: 'TEST-002'
        }
      ]
    };

    customer = await autoAddCustomerFromOrder(testOrderData2, testUser.email);
    console.log(`Sau khi tạo đơn hàng thứ 2: ${customer.name}, Đơn hàng: ${customer.totalPurchases}, Địa chỉ: ${customer.address}`);

    // Test 3: Lấy thống kê khách hàng
    console.log('\n=== TEST 3: THỐNG KÊ KHÁCH HÀNG ===');
    const finalStats = await getCustomerStats();
    console.log('Tổng khách hàng:', finalStats.totalCustomers);
    console.log('Đang hoạt động:', finalStats.activeCustomers);
    console.log('Mới tháng này:', finalStats.newCustomersThisMonth);
    console.log('Có đơn hàng:', finalStats.customersWithOrders);

    // Test 4: Lấy danh sách khách hàng VIP
    console.log('\n=== TEST 4: KHÁCH HÀNG VIP ===');
    const vipCustomers = await getVIPCustomers(5);
    console.log('Top 5 khách hàng VIP:');
    vipCustomers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name} - ${customer.totalPurchases} đơn hàng`);
    });

    // Test 5: Lấy danh sách khách hàng mới
    console.log('\n=== TEST 5: KHÁCH HÀNG MỚI ===');
    const newCustomers = await getNewCustomers(5);
    console.log('Top 5 khách hàng mới:');
    newCustomers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name} - ${new Date(customer.createdAt).toLocaleDateString('vi-VN')}`);
    });

    // Test 6: Lấy danh sách khách hàng không hoạt động
    console.log('\n=== TEST 6: KHÁCH HÀNG KHÔNG HOẠT ĐỘNG ===');
    const inactiveCustomers = await getInactiveCustomers(30);
    console.log(`Khách hàng không hoạt động trong 30 ngày: ${inactiveCustomers.length}`);
    inactiveCustomers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name} - Lần cuối: ${new Date(customer.lastPurchaseDate).toLocaleDateString('vi-VN')}`);
    });

    console.log('\n✅ Test hoàn thành thành công!');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
  testCustomerAuto();
}

module.exports = testCustomerAuto; 