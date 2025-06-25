const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const SalesEvent = require('../models/SalesEvent');
const Order = require('../models/Order');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Tạo 50 sản phẩm duy nhất dựa trên 8 mẫu có sẵn
const categories = ['Điện Gia Dụng', 'Nhà Bếp', 'Điện Tử', 'Gia Dụng Thông Minh', 'Thiết Bị Nhà Bếp', 'Thiết Bị Điện', 'Thiết Bị Thông Minh', 'Đồ Gia Dụng'];
const brands = ['Samsung', 'Xiaomi', 'Philips', 'DeLonghi', 'LG', 'Panasonic', 'Sony', 'Sharp', 'Electrolux', 'Toshiba'];
const productNames = [
  'Máy Lọc Không Khí', 'Robot Hút Bụi', 'Nồi Chiên Không Dầu', 'Máy Pha Cà Phê', 'Smart TV', 'Tủ Lạnh', 'Máy Giặt', 'Lò Vi Sóng',
  'Máy Sấy Quần Áo', 'Bếp Điện Từ', 'Máy Rửa Chén', 'Máy Lọc Nước', 'Bình Đun Siêu Tốc', 'Quạt Điều Hòa', 'Máy Hút Mùi',
  'Máy Sưởi', 'Máy Xay Sinh Tố', 'Nồi Cơm Điện', 'Bàn Ủi Hơi Nước', 'Máy Làm Sữa Hạt', 'Máy Làm Bánh Mì', 'Máy Làm Sữa Chua',
  'Máy Làm Kem', 'Máy Đánh Trứng', 'Máy Vắt Cam', 'Máy Xay Thịt', 'Máy Lọc Nước Nóng Lạnh', 'Máy Lọc Không Khí Mini',
  'Máy Lọc Không Khí Ô Tô', 'Máy Lọc Không Khí Cầm Tay', 'Máy Lọc Không Khí Di Động', 'Máy Lọc Không Khí Để Bàn',
  'Máy Lọc Không Khí Cao Cấp', 'Máy Lọc Không Khí Giá Rẻ', 'Máy Lọc Không Khí Thông Minh', 'Máy Lọc Không Khí Tự Động',
  'Máy Lọc Không Khí Công Nghiệp', 'Máy Lọc Không Khí Gia Đình', 'Máy Lọc Không Khí Văn Phòng', 'Máy Lọc Không Khí Mini USB',
  'Máy Lọc Không Khí Pin Sạc', 'Máy Lọc Không Khí Đa Năng', 'Máy Lọc Không Khí 2 Trong 1', 'Máy Lọc Không Khí 3 Trong 1',
  'Máy Lọc Không Khí 4 Trong 1', 'Máy Lọc Không Khí 5 Trong 1', 'Máy Lọc Không Khí 6 Trong 1', 'Máy Lọc Không Khí 7 Trong 1',
  'Máy Lọc Không Khí 8 Trong 1', 'Máy Lọc Không Khí 9 Trong 1'
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sampleProducts = Array.from({ length: 50 }, (_, i) => {
  const name = productNames[i % productNames.length] + ' ' + (i + 1);
  const brand = brands[i % brands.length];
  const category = categories[i % categories.length];
  const price = randomInt(1000000, 40000000);
  const originalPrice = price + randomInt(500000, 5000000);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  const stock = randomInt(10, 100);
  const soldCount = randomInt(10, 500);
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const reviewCount = randomInt(10, 1000);
  const sku = `${brand.toUpperCase()}-${category.replace(/\s/g, '').toUpperCase()}-${(i + 1).toString().padStart(3, '0')}`;
  const barcode = '880' + (1000000000 + i).toString();
  const image = `https://source.unsplash.com/400x400/?product,${encodeURIComponent(name)}`;
  const images = [image, image + '-2', image + '-3'];
  return {
    name,
    description: `${name} chất lượng cao, chính hãng ${brand}, bảo hành 12-24 tháng.`,
    price,
    originalPrice,
    discount,
    stock,
    soldCount,
    category,
    brand,
    image,
    images,
    rating: Number(rating),
    reviewCount,
    specifications: 'Thông số kỹ thuật đa dạng, vui lòng xem chi tiết.',
    warranty: randomInt(12, 36) + ' tháng',
    sku,
    supplier: `${brand} Vietnam`,
    barcode,
    tags: [name.toLowerCase(), brand.toLowerCase(), category.toLowerCase()],
    featured: i % 7 === 0,
    isActive: true
  };
});

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
const saleEventTitles = [
  'Siêu Sale Thiết Bị Nhà Bếp',
  'Sự Kiện Ra Mắt Sản Phẩm Mới',
  'Black Friday Đại Tiệc Giảm Giá',
  'Mừng Năm Mới Sale Khủng',
  'Flash Sale Điện Gia Dụng',
  'Summer Sale Sôi Động',
  'Back To School Ưu Đãi',
  'Tết Sale Rộn Ràng'
];
const saleEventImages = [
  'https://source.unsplash.com/800x400/?kitchen-appliance',
  'https://source.unsplash.com/800x400/?tech-event',
  'https://source.unsplash.com/800x400/?black-friday',
  'https://source.unsplash.com/800x400/?new-year-sale',
  'https://source.unsplash.com/800x400/?flash-sale',
  'https://source.unsplash.com/800x400/?summer-sale',
  'https://source.unsplash.com/800x400/?back-to-school',
  'https://source.unsplash.com/800x400/?tet-sale'
];
const saleEventBannerImages = [
  'https://source.unsplash.com/1200x300/?kitchen-sale',
  'https://source.unsplash.com/1200x300/?tech-launch',
  'https://source.unsplash.com/1200x300/?black-friday-banner',
  'https://source.unsplash.com/1200x300/?new-year-banner',
  'https://source.unsplash.com/1200x300/?flash-sale-banner',
  'https://source.unsplash.com/1200x300/?summer-banner',
  'https://source.unsplash.com/1200x300/?back-to-school-banner',
  'https://source.unsplash.com/1200x300/?tet-banner'
];
const saleEventTypes = ['promotion', 'event', 'promotion', 'promotion', 'promotion', 'promotion', 'event', 'promotion'];
const saleEventLocations = ['Toàn quốc', 'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Toàn quốc', 'Hà Nội', 'TP.HCM', 'Toàn quốc'];

const sampleSalesEvents = Array.from({ length: 8 }, (_, i) => ({
  title: saleEventTitles[i],
  description: `Chương trình ${saleEventTitles[i]} với nhiều ưu đãi hấp dẫn, giảm giá lên đến ${20 + i * 5}% cho hàng loạt sản phẩm hot!`,
  shortDescription: `Giảm đến ${20 + i * 5}%`,
  image: saleEventImages[i],
  bannerImage: saleEventBannerImages[i],
  startDate: new Date(2024, 0, 1 + i * 15),
  endDate: new Date(2024, 0, 10 + i * 15),
  type: saleEventTypes[i],
  status: 'active',
  location: saleEventLocations[i],
  participants: [],
  maxParticipants: 1000 + i * 100,
  budget: 20000000 + i * 5000000,
  notes: `Sự kiện ${saleEventTitles[i]} đặc biệt`,
  discountPercentage: 20 + i * 5,
  isPublic: true,
  priority: i + 1
}));

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