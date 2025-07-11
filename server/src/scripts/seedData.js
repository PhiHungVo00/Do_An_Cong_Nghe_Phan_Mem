const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const SalesEvent = require('../models/SalesEvent');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Challenge = require('../models/Challenge');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Tạo 50 sản phẩm duy nhất dựa trên các ảnh có sẵn
const categories = ['Điện Gia Dụng', 'Nhà Bếp', 'Điện Tử', 'Gia Dụng Thông Minh', 'Thiết Bị Nhà Bếp', 'Thiết Bị Điện', 'Thiết Bị Thông Minh', 'Đồ Gia Dụng'];
const brands = ['Samsung', 'Xiaomi', 'Philips', 'DeLonghi', 'LG', 'Panasonic', 'Sony', 'Sharp', 'Electrolux', 'Toshiba'];

const productImageNameMap = [
  { image: 'tulanh.jpg', name: 'Tủ Lạnh' },
  { image: 'tulanh2.jpg', name: 'Tủ Lạnh' },
  { image: 'tulanh3.jpg', name: 'Tủ Lạnh' },
  { image: 'smarttv.jpg', name: 'Smart TV' },
  { image: 'smarttv2.jpg', name: 'Smart TV' },
  { image: 'smarttv3.jpg', name: 'Smart TV' },
  { image: 'maygiat.jpg', name: 'Máy Giặt' },
  { image: 'maygiat2.jpg', name: 'Máy Giặt' },
  { image: 'maygiat3.jpg', name: 'Máy Giặt' },
  { image: 'maylocnuoc.jpg', name: 'Máy Lọc Nước' },
  { image: 'maylocnuoc2.jpg', name: 'Máy Lọc Nước' },
  { image: 'maylocnuoc3.jpg', name: 'Máy Lọc Nước' },
  { image: 'mayphacaphe.jpg', name: 'Máy Pha Cà Phê' },
  { image: 'mayphacaphe2.jpg', name: 'Máy Pha Cà Phê' },
  { image: 'mayphacaphe3.jpg', name: 'Máy Pha Cà Phê' },
  { image: 'mayruachen.jpg', name: 'Máy Rửa Chén' },
  { image: 'mayruachen2.jpg', name: 'Máy Rửa Chén' },
  { image: 'mayruachen3.jpg', name: 'Máy Rửa Chén' },
  { image: 'maysayquanao.jpg', name: 'Máy Sấy Quần Áo' },
  { image: 'maysayquanao2.jpg', name: 'Máy Sấy Quần Áo' },
  { image: 'maysayquanao3.jpg', name: 'Máy Sấy Quần Áo' },
  { image: 'noichienkhongdau.jpg', name: 'Nồi Chiên Không Dầu' },
  { image: 'noichienkhongdau2.jpg', name: 'Nồi Chiên Không Dầu' },
  { image: 'noichienkhongdau3.jpg', name: 'Nồi Chiên Không Dầu' },
  { image: 'robothutbui.jpg', name: 'Robot Hút Bụi' },
  { image: 'robothutbui2.jpg', name: 'Robot Hút Bụi' },
  { image: 'robothutbui3.jpg', name: 'Robot Hút Bụi' },
  { image: 'maylockk.jpg', name: 'Máy Lọc Khí' },
  { image: 'maylockk2.jpg', name: 'Máy Lọc Khí' },
  { image: 'maylockk3.jpg', name: 'Máy Lọc Khí' },
  { image: 'lovisong.jpg', name: 'Lò Vi Sóng' },
  { image: 'lovisong2.jpg', name: 'Lò Vi Sóng' },
  { image: 'lovisong3.jpg', name: 'Lò Vi Sóng' },
  { image: 'bepdientu.jpg', name: 'Bếp Điện Từ' },
  { image: 'bepdientu2.jpg', name: 'Bếp Điện Từ' },
  { image: 'bepdientu3.jpg', name: 'Bếp Điện Từ' },
  { image: 'maydieuhoadaikin.jpg', name: 'Máy Điều Hòa' },
  { image: 'dennguthongminh.jpg', name: 'Đèn Ngủ Thông Minh' },
  { image: 'maytaoam.jpg', name: 'Máy Tạo Ẩm' },
  { image: 'maynuocnong.jpg', name: 'Máy Nước Nóng' },
  { image: 'voisen.jpg', name: 'Vòi Sen' },
  { image: 'maysaytoc.jpg', name: 'Máy Sấy Tóc' },
  { image: 'amsieutoc.jpg', name: 'Bình Đun Siêu Tốc' },
  { image: 'quatthongminhxiaomi.jpg', name: 'Quạt Thông Minh' },
  { image: 'ocamthongminh.jpg', name: 'Ổ Cắm Thông Minh' },
  { image: 'denledthongminh.jpg', name: 'Đèn LED Thông Minh' },
  { image: 'camerathongminh.jpg', name: 'Camera Thông Minh' }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sampleProducts = Array.from({ length: 50 }, (_, i) => {
  const mapIdx = i % productImageNameMap.length;
  const { image: imageFile, name: baseName } = productImageNameMap[mapIdx];
  const name = `${baseName} ${Math.floor(i / productImageNameMap.length) + 1}`;
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
  const image = `/assets/products/${imageFile}`;
  const images = [image];
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

const CHALLENGE_DOMAIN = 'http://localhost:5000';
const EVENT_DOMAIN = 'http://localhost:5000';
const challengeImages = [
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge1.jpg`,
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge2.jpg`,
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge3.jpg`,
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge4.png`,
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge5.jpg`,
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge6.jpg`,
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge7.jpg`,
  `${CHALLENGE_DOMAIN}/assets/challenges/challenge8.jpg`,
];

const eventImages = [
  `${EVENT_DOMAIN}/assets/events/event1.jpg`,
  `${EVENT_DOMAIN}/assets/events/event2.jpg`,
  `${EVENT_DOMAIN}/assets/events/event3.jpg`,
  `${EVENT_DOMAIN}/assets/events/event4.jpg`,
  `${EVENT_DOMAIN}/assets/events/event5.jpg`,
  `${EVENT_DOMAIN}/assets/events/event6.jpg`,
  `${EVENT_DOMAIN}/assets/events/event7.jpg`,
  `${EVENT_DOMAIN}/assets/events/event8.jpg`,
];

const sampleSalesEvents = Array.from({ length: 8 }, (_, i) => ({
  title: saleEventTitles[i],
  description: `Chương trình ${saleEventTitles[i]} với nhiều ưu đãi hấp dẫn, giảm giá lên đến ${20 + i * 5}% cho hàng loạt sản phẩm hot!`,
  shortDescription: `Giảm đến ${20 + i * 5}%`,
  image: eventImages[i % eventImages.length],
  bannerImage: eventImages[i % eventImages.length],
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

const challengeTitles = [
  'Tiết Kiệm Điện Nước',
  'Sống Xanh Mỗi Ngày',
  'Không Sử Dụng Nhựa',
  'Tái Chế Sáng Tạo',
  'Ăn Uống Lành Mạnh',
  'Tập Thể Dục 30 Ngày',
  'Dọn Dẹp Nhà Cửa',
  'Chia Sẻ Yêu Thương'
];

const challengeDescriptions = [
  'Giảm 20% hóa đơn điện nước trong tháng này bằng cách sử dụng thiết bị tiết kiệm năng lượng.',
  'Tham gia các hoạt động bảo vệ môi trường như trồng cây, đi xe đạp, hạn chế rác thải.',
  'Không sử dụng túi nilon và sản phẩm nhựa dùng một lần trong 7 ngày.',
  'Tái chế các vật dụng cũ thành sản phẩm hữu ích hoặc trang trí.',
  'Ăn đủ rau xanh, hạn chế đồ ngọt và nước ngọt có gas trong 14 ngày.',
  'Tập thể dục ít nhất 20 phút mỗi ngày liên tục trong 30 ngày.',
  'Dành 1 giờ mỗi tuần để dọn dẹp, sắp xếp lại không gian sống.',
  'Chia sẻ đồ dùng, quần áo hoặc thực phẩm cho người khó khăn xung quanh bạn.'
];

const challengeRewards = [
  '500.000 VNĐ',
  'Voucher mua sắm 300.000 VNĐ',
  'Bình nước giữ nhiệt cao cấp',
  'Phiếu mua hàng 200.000 VNĐ',
  'Bộ dụng cụ nhà bếp',
  'Thẻ tập gym 1 tháng',
  'Phiếu giảm giá 20%',
  'Quà tặng bí mật'
];

const sampleChallenges = Array.from({ length: 8 }, (_, i) => ({
  title: challengeTitles[i],
  description: challengeDescriptions[i],
  shortDescription: challengeDescriptions[i].substring(0, 100) + '...',
  image: challengeImages[i % challengeImages.length],
  bannerImage: challengeImages[i % challengeImages.length],
  reward: challengeRewards[i],
  participants: [],
  maxParticipants: Math.floor(Math.random() * 1000) + 100,
  startDate: new Date(2024, 3, 1 + i * 3),
  endDate: new Date(2024, 3, 3 + i * 3),
  type: ['shopping', 'social', 'creative', 'other'][i % 4],
  status: i === 0 ? 'active' : (i < 3 ? 'draft' : 'inactive'),
  requirements: `Yêu cầu tham gia thử thách ${i + 1}: Hoàn thành các nhiệm vụ được giao trong thời gian quy định.`,
  rules: `Luật chơi thử thách ${i + 1}: Tuân thủ các quy định và không gian lận trong quá trình tham gia.`,
  isPublic: true,
  priority: i + 1
}));

// Bổ sung seed cho các category dạng key tiếng Anh để đồng bộ với frontend
const englishCategoryProducts = [
  // Kitchen
  {
    name: 'Nồi cơm điện thông minh Philips',
    description: 'Nồi cơm điện thông minh với công nghệ nấu 3D, giữ ấm 24h',
    price: 2990000,
    originalPrice: 3490000,
    discount: 15,
    stock: 50,
    soldCount: 120,
    category: 'kitchen',
    brand: 'Philips',
    image: '/assets/products/bepdientu.jpg',
    images: ['/assets/products/bepdientu.jpg'],
    rating: 4.5,
    reviewCount: 128,
    specifications: 'Công suất 1000W, dung tích 1.8L',
    warranty: '24 tháng',
    sku: 'PHILIPS-KITCHEN-001',
    supplier: 'Philips Vietnam',
    barcode: '880000000001',
    tags: ['nồi cơm', 'kitchen', 'philips'],
    featured: true,
    isActive: true
  },
  {
    name: 'Máy rửa chén Bosch',
    description: 'Máy rửa chén công nghệ Đức, tiết kiệm nước và điện',
    price: 15990000,
    originalPrice: 17990000,
    discount: 10,
    stock: 30,
    soldCount: 80,
    category: 'kitchen',
    brand: 'Bosch',
    image: '/assets/products/mayruachen.jpg',
    images: ['/assets/products/mayruachen.jpg'],
    rating: 4.8,
    reviewCount: 89,
    specifications: 'Công suất 1800W, 12 bộ chén đĩa',
    warranty: '24 tháng',
    sku: 'BOSCH-KITCHEN-002',
    supplier: 'Bosch Vietnam',
    barcode: '880000000002',
    tags: ['máy rửa chén', 'kitchen', 'bosch'],
    featured: false,
    isActive: true
  },
  {
    name: 'Lò vi sóng Samsung',
    description: 'Lò vi sóng điện tử với nhiều chế độ nấu tự động',
    price: 3490000,
    originalPrice: 3990000,
    discount: 12,
    stock: 45,
    soldCount: 60,
    category: 'kitchen',
    brand: 'Samsung',
    image: '/assets/products/lovisong.jpg',
    images: ['/assets/products/lovisong.jpg'],
    rating: 4.6,
    reviewCount: 156,
    specifications: 'Công suất 900W, dung tích 23L',
    warranty: '18 tháng',
    sku: 'SAMSUNG-KITCHEN-003',
    supplier: 'Samsung Vietnam',
    barcode: '880000000003',
    tags: ['lò vi sóng', 'kitchen', 'samsung'],
    featured: false,
    isActive: true
  },
  // Livingroom
  {
    name: 'Smart TV Samsung 65 inch',
    description: 'Smart TV 4K với công nghệ QLED mới nhất',
    price: 28990000,
    originalPrice: 32990000,
    discount: 15,
    stock: 20,
    soldCount: 100,
    category: 'livingroom',
    brand: 'Samsung',
    image: '/assets/products/smarttv.jpg',
    images: ['/assets/products/smarttv.jpg'],
    rating: 4.9,
    reviewCount: 234,
    specifications: '4K QLED, 65 inch',
    warranty: '24 tháng',
    sku: 'SAMSUNG-LIVINGROOM-001',
    supplier: 'Samsung Vietnam',
    barcode: '880000000004',
    tags: ['tv', 'livingroom', 'samsung'],
    featured: true,
    isActive: true
  },
  {
    name: 'Máy lọc không khí LG',
    description: 'Máy lọc không khí với cảm biến bụi mịn PM2.5',
    price: 7990000,
    originalPrice: 8990000,
    discount: 11,
    stock: 40,
    soldCount: 70,
    category: 'livingroom',
    brand: 'LG',
    image: '/assets/products/maylockk.jpg',
    images: ['/assets/products/maylockk.jpg'],
    rating: 4.7,
    reviewCount: 167,
    specifications: 'Cảm biến PM2.5, lọc 5 lớp',
    warranty: '18 tháng',
    sku: 'LG-LIVINGROOM-002',
    supplier: 'LG Vietnam',
    barcode: '880000000005',
    tags: ['máy lọc không khí', 'livingroom', 'lg'],
    featured: false,
    isActive: true
  },
  {
    name: 'Quạt thông minh Xiaomi',
    description: 'Quạt điều khiển qua điện thoại với 100 cấp độ gió',
    price: 1990000,
    originalPrice: 2290000,
    discount: 13,
    stock: 60,
    soldCount: 50,
    category: 'livingroom',
    brand: 'Xiaomi',
    image: '/assets/products/quatthongminhxiaomi.jpg',
    images: ['/assets/products/quatthongminhxiaomi.jpg'],
    rating: 4.5,
    reviewCount: 145,
    specifications: 'Điều khiển từ xa, 100 cấp độ gió',
    warranty: '12 tháng',
    sku: 'XIAOMI-LIVINGROOM-003',
    supplier: 'Xiaomi Vietnam',
    barcode: '880000000006',
    tags: ['quạt', 'livingroom', 'xiaomi'],
    featured: false,
    isActive: true
  },
  // Bedroom
  {
    name: 'Máy điều hòa Daikin Inverter',
    description: 'Điều hòa inverter tiết kiệm điện với chế độ ngủ thông minh',
    price: 11990000,
    originalPrice: 13990000,
    discount: 12,
    stock: 35,
    soldCount: 40,
    category: 'bedroom',
    brand: 'Daikin',
    image: '/assets/products/maydieuhoadaikin.jpg',
    images: ['/assets/products/maydieuhoadaikin.jpg'],
    rating: 4.8,
    reviewCount: 223,
    specifications: '12000 BTU, inverter',
    warranty: '24 tháng',
    sku: 'DAIKIN-BEDROOM-001',
    supplier: 'Daikin Vietnam',
    barcode: '880000000007',
    tags: ['điều hòa', 'bedroom', 'daikin'],
    featured: true,
    isActive: true
  },
  {
    name: 'Đèn ngủ thông minh',
    description: 'Đèn ngủ điều chỉnh độ sáng và màu sắc qua điện thoại',
    price: 890000,
    originalPrice: 1090000,
    discount: 18,
    stock: 70,
    soldCount: 30,
    category: 'bedroom',
    brand: 'Mi Home',
    image: '/assets/products/dennguthongminh.jpg',
    images: ['/assets/products/dennguthongminh.jpg'],
    rating: 4.4,
    reviewCount: 134,
    specifications: 'Điều chỉnh màu, cảm ứng',
    warranty: '12 tháng',
    sku: 'MIHOME-BEDROOM-002',
    supplier: 'Mi Home Vietnam',
    barcode: '880000000008',
    tags: ['đèn ngủ', 'bedroom', 'mihome'],
    featured: false,
    isActive: true
  },
  {
    name: 'Máy tạo ẩm Beurer',
    description: 'Máy tạo ẩm siêu âm với đèn LED đổi màu',
    price: 1490000,
    originalPrice: 1690000,
    discount: 12,
    stock: 45,
    soldCount: 20,
    category: 'bedroom',
    brand: 'Beurer',
    image: '/assets/products/maytaoam.jpg',
    images: ['/assets/products/maytaoam.jpg'],
    rating: 4.5,
    reviewCount: 156,
    specifications: 'Siêu âm, đèn LED',
    warranty: '12 tháng',
    sku: 'BEURER-BEDROOM-003',
    supplier: 'Beurer Vietnam',
    barcode: '880000000009',
    tags: ['máy tạo ẩm', 'bedroom', 'beurer'],
    featured: false,
    isActive: true
  },
  // Bathroom
  {
    name: 'Máy nước nóng Ariston',
    description: 'Máy nước nóng trực tiếp với công nghệ tiết kiệm điện',
    price: 5990000,
    originalPrice: 6990000,
    discount: 15,
    stock: 30,
    soldCount: 25,
    category: 'bathroom',
    brand: 'Ariston',
    image: '/assets/products/maynuocnong.jpg',
    images: ['/assets/products/maynuocnong.jpg'],
    rating: 4.7,
    reviewCount: 189,
    specifications: 'Công suất 4500W',
    warranty: '24 tháng',
    sku: 'ARISTON-BATHROOM-001',
    supplier: 'Ariston Vietnam',
    barcode: '880000000010',
    tags: ['máy nước nóng', 'bathroom', 'ariston'],
    featured: true,
    isActive: true
  },
  {
    name: 'Vòi sen thông minh',
    description: 'Vòi sen với chế độ massage và điều chỉnh áp lực nước',
    price: 2490000,
    originalPrice: 2990000,
    discount: 17,
    stock: 50,
    soldCount: 15,
    category: 'bathroom',
    brand: 'TOTO',
    image: '/assets/products/voisen.jpg',
    images: ['/assets/products/voisen.jpg'],
    rating: 4.6,
    reviewCount: 145,
    specifications: 'Massage, điều chỉnh áp lực',
    warranty: '12 tháng',
    sku: 'TOTO-BATHROOM-002',
    supplier: 'TOTO Vietnam',
    barcode: '880000000011',
    tags: ['vòi sen', 'bathroom', 'toto'],
    featured: false,
    isActive: true
  },
  {
    name: 'Máy sấy tóc Panasonic',
    description: 'Máy sấy tóc công suất lớn, bảo vệ tóc tối ưu',
    price: 990000,
    originalPrice: 1290000,
    discount: 23,
    stock: 60,
    soldCount: 10,
    category: 'bathroom',
    brand: 'Panasonic',
    image: '/assets/products/maysaytoc.jpg',
    images: ['/assets/products/maysaytoc.jpg'],
    rating: 4.5,
    reviewCount: 100,
    specifications: 'Công suất 2000W',
    warranty: '12 tháng',
    sku: 'PANASONIC-BATHROOM-003',
    supplier: 'Panasonic Vietnam',
    barcode: '880000000012',
    tags: ['máy sấy tóc', 'bathroom', 'panasonic'],
    featured: false,
    isActive: true
  },
  // Appliance
  {
    name: 'Máy hút bụi Electrolux',
    description: 'Máy hút bụi công suất lớn, lọc HEPA',
    price: 2990000,
    originalPrice: 3490000,
    discount: 14,
    stock: 40,
    soldCount: 30,
    category: 'appliance',
    brand: 'Electrolux',
    image: '/assets/products/robothutbui.jpg',
    images: ['/assets/products/robothutbui.jpg'],
    rating: 4.6,
    reviewCount: 120,
    specifications: 'Công suất 1800W, lọc HEPA',
    warranty: '18 tháng',
    sku: 'ELECTROLUX-APPLIANCE-001',
    supplier: 'Electrolux Vietnam',
    barcode: '880000000013',
    tags: ['máy hút bụi', 'appliance', 'electrolux'],
    featured: true,
    isActive: true
  },
  {
    name: 'Bình đun siêu tốc Sharp',
    description: 'Bình đun siêu tốc dung tích 1.8L, tự ngắt khi sôi',
    price: 590000,
    originalPrice: 790000,
    discount: 25,
    stock: 80,
    soldCount: 20,
    category: 'appliance',
    brand: 'Sharp',
    image: '/assets/products/amsieutoc.jpg',
    images: ['/assets/products/amsieutoc.jpg'],
    rating: 4.3,
    reviewCount: 90,
    specifications: 'Công suất 1500W, 1.8L',
    warranty: '12 tháng',
    sku: 'SHARP-APPLIANCE-002',
    supplier: 'Sharp Vietnam',
    barcode: '880000000014',
    tags: ['bình đun', 'appliance', 'sharp'],
    featured: false,
    isActive: true
  },
  {
    name: 'Máy sấy quần áo Panasonic',
    description: 'Máy sấy quần áo công suất lớn, tiết kiệm điện',
    price: 4990000,
    originalPrice: 5990000,
    discount: 17,
    stock: 30,
    soldCount: 15,
    category: 'appliance',
    brand: 'Panasonic',
    image: '/assets/products/maysayquanao.jpg',
    images: ['/assets/products/maysayquanao.jpg'],
    rating: 4.4,
    reviewCount: 80,
    specifications: 'Công suất 2200W',
    warranty: '18 tháng',
    sku: 'PANASONIC-APPLIANCE-003',
    supplier: 'Panasonic Vietnam',
    barcode: '880000000015',
    tags: ['máy sấy quần áo', 'appliance', 'panasonic'],
    featured: false,
    isActive: true
  },
  // Smart
  {
    name: 'Ổ cắm thông minh Xiaomi',
    description: 'Ổ cắm điều khiển qua điện thoại, hẹn giờ tự động',
    price: 390000,
    originalPrice: 490000,
    discount: 20,
    stock: 100,
    soldCount: 40,
    category: 'smart',
    brand: 'Xiaomi',
    image: '/assets/products/ocamthongminh.jpg',
    images: ['/assets/products/ocamthongminh.jpg'],
    rating: 4.5,
    reviewCount: 110,
    specifications: 'Điều khiển từ xa, hẹn giờ',
    warranty: '12 tháng',
    sku: 'XIAOMI-SMART-001',
    supplier: 'Xiaomi Vietnam',
    barcode: '880000000016',
    tags: ['ổ cắm', 'smart', 'xiaomi'],
    featured: true,
    isActive: true
  },
  {
    name: 'Đèn LED thông minh Philips Hue',
    description: 'Đèn LED đổi màu, điều khiển qua app',
    price: 690000,
    originalPrice: 890000,
    discount: 22,
    stock: 70,
    soldCount: 30,
    category: 'smart',
    brand: 'Philips',
    image: '/assets/products/denledthongminh.jpg',
    images: ['/assets/products/denledthongminh.jpg'],
    rating: 4.6,
    reviewCount: 95,
    specifications: 'Đổi màu, điều khiển app',
    warranty: '12 tháng',
    sku: 'PHILIPS-SMART-002',
    supplier: 'Philips Vietnam',
    barcode: '880000000017',
    tags: ['đèn led', 'smart', 'philips'],
    featured: false,
    isActive: true
  },
  {
    name: 'Camera an ninh thông minh',
    description: 'Camera quan sát kết nối wifi, báo động chuyển động',
    price: 1290000,
    originalPrice: 1590000,
    discount: 19,
    stock: 60,
    soldCount: 20,
    category: 'smart',
    brand: 'Ezviz',
    image: '/assets/products/camerathongminh.jpg',
    images: ['/assets/products/camerathongminh.jpg'],
    rating: 4.4,
    reviewCount: 80,
    specifications: 'Kết nối wifi, báo động',
    warranty: '18 tháng',
    sku: 'EZVIZ-SMART-003',
    supplier: 'Ezviz Vietnam',
    barcode: '880000000018',
    tags: ['camera', 'smart', 'ezviz'],
    featured: false,
    isActive: true
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
    await Challenge.deleteMany({});
    console.log('Cleared existing data');

    // Create users (password will be hashed by pre-save hook)
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
    }
    // Thêm shipper mẫu
    const sampleShippers = [
      {
        username: 'shipper1',
        email: 'shipper1@delivery.com',
        password: 'shipper123',
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        role: 'shipper',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        isActive: true
      },
      {
        username: 'shipper2',
        email: 'shipper2@delivery.com',
        password: 'shipper123',
        fullName: 'Trần Thị B',
        phone: '0987654321',
        role: 'shipper',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        isActive: true
      },
      {
        username: 'shipper3',
        email: 'shipper3@delivery.com',
        password: 'shipper123',
        fullName: 'Lê Văn C',
        phone: '0555666777',
        role: 'shipper',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        isActive: true
      }
    ];
    for (const shipperData of sampleShippers) {
      const exists = await User.findOne({ $or: [ { username: shipperData.username }, { email: shipperData.email } ] });
      if (!exists) {
        const shipper = new User(shipperData);
        await shipper.save();
      }
    }
    const createdUsers = await User.find({});
    console.log(`Created ${createdUsers.length} users`);

    // Insert products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    // Thêm các sản phẩm tiếng Anh vào database
    await Product.insertMany(englishCategoryProducts);
    console.log(`Created ${englishCategoryProducts.length} English category products`);

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

    // Insert challenges
    for (const challengeData of sampleChallenges) {
      const challenge = new Challenge({
        ...challengeData,
        createdBy: adminUser._id
      });
      await challenge.save();
    }
    console.log(`Created ${sampleChallenges.length} challenges`);

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