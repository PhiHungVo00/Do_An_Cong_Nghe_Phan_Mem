const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const SalesEvent = require('../models/SalesEvent');
const Order = require('../models/Order');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Sample products data with new fields
const sampleProducts = [
  {
    name: 'Máy Lọc Không Khí Samsung',
    description: 'Máy lọc không khí thông minh với công nghệ tiên tiến, loại bỏ 99.9% bụi mịn và vi khuẩn',
    price: 4990000,
    originalPrice: 5990000,
    discount: 17,
    stock: 50,
    soldCount: 125,
    category: 'Điện Gia Dụng',
    brand: 'Samsung',
    image: 'https://source.unsplash.com/400x400/?air-purifier',
    images: [
      'https://source.unsplash.com/400x400/?air-purifier',
      'https://source.unsplash.com/400x400/?air-purifier-2',
      'https://source.unsplash.com/400x400/?air-purifier-3'
    ],
    rating: 4.8,
    reviewCount: 356,
    specifications: 'Công suất: 60W, Diện tích sử dụng: 50m², Độ ồn: <25dB',
    warranty: '24 tháng',
    sku: 'SAMSUNG-AIR-001',
    supplier: 'Samsung Electronics',
    barcode: '8801641234567',
    tags: ['máy lọc không khí', 'thông minh', 'samsung'],
    featured: true,
    isActive: true
  },
  {
    name: 'Robot Hút Bụi Thông Minh',
    description: 'Robot hút bụi tự động với điều khiển qua app, lập bản đồ thông minh',
    price: 7990000,
    originalPrice: 8990000,
    discount: 11,
    stock: 30,
    soldCount: 89,
    category: 'Điện Gia Dụng',
    brand: 'Xiaomi',
    image: 'https://source.unsplash.com/400x400/?robot-vacuum',
    images: [
      'https://source.unsplash.com/400x400/?robot-vacuum',
      'https://source.unsplash.com/400x400/?robot-vacuum-2'
    ],
    rating: 4.7,
    reviewCount: 245,
    specifications: 'Pin: 5200mAh, Thời gian hoạt động: 150 phút, Lập bản đồ: LIDAR',
    warranty: '12 tháng',
    sku: 'XIAOMI-ROBOT-001',
    supplier: 'Xiaomi Technology',
    barcode: '6934177701234',
    tags: ['robot hút bụi', 'thông minh', 'xiaomi'],
    featured: true,
    isActive: true
  },
  {
    name: 'Nồi Chiên Không Dầu',
    description: 'Nồi chiên không dầu đa năng với 8 chế độ nấu, tiết kiệm 80% dầu mỡ',
    price: 2490000,
    originalPrice: 2990000,
    discount: 17,
    stock: 100,
    soldCount: 234,
    category: 'Nhà Bếp',
    brand: 'Philips',
    image: 'https://source.unsplash.com/400x400/?air-fryer',
    images: [
      'https://source.unsplash.com/400x400/?air-fryer',
      'https://source.unsplash.com/400x400/?air-fryer-2'
    ],
    rating: 4.9,
    reviewCount: 567,
    specifications: 'Dung tích: 4.1L, Công suất: 1500W, Nhiệt độ: 80-200°C',
    warranty: '24 tháng',
    sku: 'PHILIPS-FRYER-001',
    supplier: 'Philips Vietnam',
    barcode: '8710103745678',
    tags: ['nồi chiên', 'không dầu', 'philips'],
    featured: true,
    isActive: true
  },
  {
    name: 'Máy Pha Cà Phê Tự Động',
    description: 'Máy pha cà phê tự động với 15 chế độ pha, tích hợp máy xay',
    price: 5990000,
    originalPrice: 6990000,
    discount: 14,
    stock: 25,
    soldCount: 67,
    category: 'Nhà Bếp',
    brand: 'DeLonghi',
    image: 'https://source.unsplash.com/400x400/?coffee-machine',
    images: [
      'https://source.unsplash.com/400x400/?coffee-machine',
      'https://source.unsplash.com/400x400/?coffee-machine-2'
    ],
    rating: 4.6,
    reviewCount: 189,
    specifications: 'Áp suất: 15 bar, Bình chứa nước: 1.8L, Công suất: 1450W',
    warranty: '24 tháng',
    sku: 'DELONGHI-COFFEE-001',
    supplier: 'DeLonghi Vietnam',
    barcode: '8004390123456',
    tags: ['máy pha cà phê', 'tự động', 'delonghi'],
    featured: false,
    isActive: true
  },
  {
    name: 'Smart TV QLED 65"',
    description: 'Smart TV QLED 4K với công nghệ AI, âm thanh Dolby Atmos',
    price: 35900000,
    originalPrice: 39900000,
    discount: 10,
    stock: 15,
    soldCount: 23,
    category: 'Điện Tử',
    brand: 'Samsung',
    image: 'https://source.unsplash.com/400x400/?smart-tv',
    images: [
      'https://source.unsplash.com/400x400/?smart-tv',
      'https://source.unsplash.com/400x400/?smart-tv-2'
    ],
    rating: 4.7,
    reviewCount: 123,
    specifications: 'Độ phân giải: 4K UHD, HDR: Quantum HDR, Âm thanh: Dolby Atmos',
    warranty: '24 tháng',
    sku: 'SAMSUNG-TV-001',
    supplier: 'Samsung Electronics',
    barcode: '8801647890123',
    tags: ['smart tv', 'qled', '4k', 'samsung'],
    featured: true,
    isActive: true
  },
  {
    name: 'Tủ Lạnh Side by Side',
    description: 'Tủ lạnh side by side với công nghệ Inverter, ngăn đá mềm',
    price: 28900000,
    originalPrice: 32900000,
    discount: 12,
    stock: 20,
    soldCount: 45,
    category: 'Điện Gia Dụng',
    brand: 'LG',
    image: 'https://source.unsplash.com/400x400/?refrigerator',
    images: [
      'https://source.unsplash.com/400x400/?refrigerator',
      'https://source.unsplash.com/400x400/?refrigerator-2'
    ],
    rating: 4.8,
    reviewCount: 234,
    specifications: 'Dung tích: 668L, Công nghệ: Inverter, Ngăn đá mềm: Có',
    warranty: '24 tháng',
    sku: 'LG-FRIDGE-001',
    supplier: 'LG Electronics',
    barcode: '8806084567890',
    tags: ['tủ lạnh', 'side by side', 'lg'],
    featured: false,
    isActive: true
  },
  {
    name: 'Máy Giặt Cửa Trước',
    description: 'Máy giặt cửa trước với công nghệ Steam, tiết kiệm nước',
    price: 12900000,
    originalPrice: 14900000,
    discount: 13,
    stock: 40,
    soldCount: 78,
    category: 'Điện Gia Dụng',
    brand: 'Samsung',
    image: 'https://source.unsplash.com/400x400/?washing-machine',
    images: [
      'https://source.unsplash.com/400x400/?washing-machine',
      'https://source.unsplash.com/400x400/?washing-machine-2'
    ],
    rating: 4.6,
    reviewCount: 178,
    specifications: 'Khối lượng giặt: 9kg, Công nghệ: Steam, Tiết kiệm nước: A+++',
    warranty: '24 tháng',
    sku: 'SAMSUNG-WASHER-001',
    supplier: 'Samsung Electronics',
    barcode: '8801642345678',
    tags: ['máy giặt', 'cửa trước', 'samsung'],
    featured: false,
    isActive: true
  },
  {
    name: 'Lò Vi Sóng Digital',
    description: 'Lò vi sóng digital với 25 chế độ nấu, nướng đối lưu',
    price: 3990000,
    originalPrice: 4590000,
    discount: 13,
    stock: 60,
    soldCount: 156,
    category: 'Nhà Bếp',
    brand: 'Panasonic',
    image: 'https://source.unsplash.com/400x400/?microwave',
    images: [
      'https://source.unsplash.com/400x400/?microwave',
      'https://source.unsplash.com/400x400/?microwave-2'
    ],
    rating: 4.5,
    reviewCount: 156,
    specifications: 'Công suất: 1000W, Dung tích: 27L, Nướng đối lưu: Có',
    warranty: '12 tháng',
    sku: 'PANASONIC-MICRO-001',
    supplier: 'Panasonic Vietnam',
    barcode: '8858990123456',
    tags: ['lò vi sóng', 'digital', 'panasonic'],
    featured: false,
    isActive: true
  }
];

// Sample users data
const sampleUsers = [
  {
    username: 'admin',
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '0123456789',
    isActive: true
  },
  {
    username: 'user1',
    fullName: 'Nguyễn Văn A',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    phone: '0987654321',
    isActive: true
  }
];

// Sample sales events data
const sampleSalesEvents = [
  {
    title: 'Siêu Sale Thiết Bị Nhà Bếp',
    description: 'Chương trình khuyến mãi lớn nhất năm cho các thiết bị nhà bếp cao cấp',
    shortDescription: 'Giảm đến 30% thiết bị nhà bếp',
    image: 'https://source.unsplash.com/800x400/?kitchen-appliance',
    bannerImage: 'https://source.unsplash.com/1200x300/?kitchen-sale',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    type: 'promotion',
    status: 'active',
    location: 'Toàn quốc',
    participants: ['user1', 'user2', 'user3'],
    maxParticipants: 1000,
    budget: 50000000,
    notes: 'Chương trình khuyến mãi đặc biệt',
    discountPercentage: 30,
    isPublic: true,
    priority: 1
  },
  {
    title: 'Sự Kiện Ra Mắt Sản Phẩm Mới',
    description: 'Sự kiện ra mắt các sản phẩm công nghệ mới nhất',
    shortDescription: 'Khám phá công nghệ mới',
    image: 'https://source.unsplash.com/800x400/?tech-event',
    bannerImage: 'https://source.unsplash.com/1200x300/?tech-launch',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-15'),
    type: 'event',
    status: 'active',
    location: 'Hà Nội',
    participants: ['admin', 'employee1'],
    maxParticipants: 200,
    budget: 20000000,
    notes: 'Sự kiện quan trọng',
    isPublic: true,
    priority: 2
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await SalesEvent.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create users (password will be hashed by pre-save hook)
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
    }
    const createdUsers = await User.find({});
    console.log(`Created ${createdUsers.length} users`);

    // Insert products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    // Create sales events
    const adminUser = await User.findOne({ role: 'admin' });
    for (const eventData of sampleSalesEvents) {
      const event = new SalesEvent({
        ...eventData,
        createdBy: adminUser._id
      });
      await event.save();
    }
    console.log(`Created ${sampleSalesEvents.length} sales events`);

    console.log('Data seeding completed successfully!');
    console.log('\nSample accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedData(); 