const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const BASE_URL = 'http://localhost:5000/api';
const ADMIN_LOGIN = { username: 'admin', password: 'admin123' };

// Test data for products (no _id, all required fields)
const testProducts = [
  {
    name: 'Tủ lạnh Samsung',
    sku: 'SKU001',
    price: 15000000,
    soldCount: 25,
    stock: 50,
    isActive: true,
    image: 'tulanh.jpg',
    warranty: '24 tháng',
    specifications: 'Màu: Trắng, Kích thước: Lớn, Dung tích: 300L',
    brand: 'Samsung',
    category: 'Tủ lạnh',
    description: 'Tủ lạnh tiết kiệm điện, dung tích lớn.'
  },
  {
    name: 'Máy giặt LG',
    sku: 'SKU002',
    price: 18000000,
    soldCount: 30,
    stock: 40,
    isActive: true,
    image: 'maygiat.jpg',
    warranty: '24 tháng',
    specifications: 'Màu: Bạc, Kích thước: Vừa, Tải trọng: 9kg',
    brand: 'LG',
    category: 'Máy giặt',
    description: 'Máy giặt cửa trước, tiết kiệm nước.'
  },
  {
    name: 'Tivi Sony',
    sku: 'SKU003',
    price: 32000000,
    soldCount: 15,
    stock: 30,
    isActive: true,
    image: 'smarttv.jpg',
    warranty: '36 tháng',
    specifications: 'Kích thước: 55 inch, Độ phân giải: 4K, Smart TV: Có',
    brand: 'Sony',
    category: 'Tivi',
    description: 'Tivi thông minh, hình ảnh sắc nét.'
  },
  {
    name: 'Máy lọc nước',
    sku: 'SKU004',
    price: 8000000,
    soldCount: 40,
    stock: 60,
    isActive: true,
    image: 'maylocnuoc.jpg',
    warranty: '12 tháng',
    specifications: 'Công nghệ: RO, Công suất: 10L/h',
    brand: 'Kangaroo',
    category: 'Máy lọc nước',
    description: 'Máy lọc nước RO cao cấp.'
  },
  {
    name: 'Robot hút bụi',
    sku: 'SKU005',
    price: 12000000,
    soldCount: 20,
    stock: 35,
    isActive: true,
    image: 'robothutbui.jpg',
    warranty: '18 tháng',
    specifications: 'Pin: 5200mAh, Thông minh: Có',
    brand: 'Xiaomi',
    category: 'Robot hút bụi',
    description: 'Robot hút bụi thông minh, điều khiển qua app.'
  }
];

const testCustomers = [
  {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    address: 'Hà Nội, Việt Nam',
    totalPurchases: 2500000,
    lastPurchaseDate: new Date('2024-01-15'),
    isActive: true
  },
  {
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0987654321',
    address: 'Hồ Chí Minh, Việt Nam',
    totalPurchases: 1800000,
    lastPurchaseDate: new Date('2024-01-20'),
    isActive: true
  },
  {
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0555666777',
    address: 'Đà Nẵng, Việt Nam',
    totalPurchases: 3200000,
    lastPurchaseDate: new Date('2024-02-10'),
    isActive: true
  },
  {
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '0333444555',
    address: 'Cần Thơ, Việt Nam',
    totalPurchases: 1500000,
    lastPurchaseDate: new Date('2024-02-15'),
    isActive: true
  },
  {
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    phone: '0777888999',
    address: 'Hải Phòng, Việt Nam',
    totalPurchases: 2800000,
    lastPurchaseDate: new Date('2024-03-05'),
    isActive: true
  }
];

async function seedTestData() {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const Customer = require('../models/Customer');

    console.log('🌱 Seeding test data...');

    // Clear existing data
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});

    // Insert products and get their _id
    const insertedProducts = await Product.insertMany(testProducts);

    // Map product name to _id for easy reference
    const productMap = {};
    insertedProducts.forEach(p => { productMap[p.name] = p._id; });

    // Prepare orders with correct productId
    const testOrders = [
      {
        orderNumber: 'ORD001',
        customer: 'Nguyễn Văn A',
        totalAmount: 2500000,
        status: 'Đã giao hàng',
        date: new Date('2024-01-15'),
        shippingAddress: 'Hà Nội, Việt Nam',
        paymentMethod: 'COD',
        items: [
          { productId: productMap['Tủ lạnh Samsung'], productName: 'Tủ lạnh Samsung', quantity: 2, price: 1250000 }
        ]
      },
      {
        orderNumber: 'ORD002',
        customer: 'Trần Thị B',
        totalAmount: 1800000,
        status: 'Đã hoàn thành',
        date: new Date('2024-01-20'),
        shippingAddress: 'Hồ Chí Minh, Việt Nam',
        paymentMethod: 'COD',
        items: [
          { productId: productMap['Máy giặt LG'], productName: 'Máy giặt LG', quantity: 1, price: 1800000 }
        ]
      },
      {
        orderNumber: 'ORD003',
        customer: 'Lê Văn C',
        totalAmount: 3200000,
        status: 'Đã giao hàng',
        date: new Date('2024-02-10'),
        shippingAddress: 'Đà Nẵng, Việt Nam',
        paymentMethod: 'COD',
        items: [
          { productId: productMap['Tivi Sony'], productName: 'Tivi Sony', quantity: 1, price: 3200000 }
        ]
      },
      {
        orderNumber: 'ORD004',
        customer: 'Phạm Thị D',
        totalAmount: 1500000,
        status: 'Đã hoàn thành',
        date: new Date('2024-02-15'),
        shippingAddress: 'Cần Thơ, Việt Nam',
        paymentMethod: 'COD',
        items: [
          { productId: productMap['Tủ lạnh Samsung'], productName: 'Tủ lạnh Samsung', quantity: 1, price: 1500000 }
        ]
      },
      {
        orderNumber: 'ORD005',
        customer: 'Hoàng Văn E',
        totalAmount: 2800000,
        status: 'Đã giao hàng',
        date: new Date('2024-03-05'),
        shippingAddress: 'Hải Phòng, Việt Nam',
        paymentMethod: 'COD',
        items: [
          { productId: productMap['Máy giặt LG'], productName: 'Máy giặt LG', quantity: 1, price: 2800000 }
        ]
      }
    ];

    // Insert customers and orders
    await Customer.insertMany(testCustomers);
    await Order.insertMany(testOrders);

    console.log('✅ Test data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  }
}

async function loginAdmin() {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, ADMIN_LOGIN);
    return res.data.token;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testAnalyticsAPI(token) {
  try {
    console.log('\n🧪 Testing Analytics API...');

    // Test 1: Dashboard Stats
    console.log('\n1. Testing Dashboard Stats...');
    const statsResponse = await axios.get(`${BASE_URL}/analytics/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard Stats:', statsResponse.data);

    // Test 2: Sales Analytics
    console.log('\n2. Testing Sales Analytics...');
    const salesResponse = await axios.get(`${BASE_URL}/analytics/sales?period=month`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Sales Analytics:', salesResponse.data);

    // Test 3: Traffic Analytics
    console.log('\n3. Testing Traffic Analytics...');
    const trafficResponse = await axios.get(`${BASE_URL}/analytics/traffic?period=week`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Traffic Analytics:', trafficResponse.data);

    // Test 4: Top Selling Products
    console.log('\n4. Testing Top Selling Products...');
    const topProductsResponse = await axios.get(`${BASE_URL}/analytics/top-selling?limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Top Selling Products:', topProductsResponse.data);

    // Test 5: Customer Analytics
    console.log('\n5. Testing Customer Analytics...');
    const customerResponse = await axios.get(`${BASE_URL}/analytics/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Customer Analytics:', customerResponse.data);

    console.log('\n🎉 All analytics tests passed!');

  } catch (error) {
    console.error('❌ Analytics test failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  try {
    // Seed test data first
    await seedTestData();
    
    // Wait a moment for data to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Login admin
    const token = await loginAdmin();
    
    // Test analytics API
    await testAnalyticsAPI(token);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔚 Database connection closed');
  }
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 