const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Employee = require('../models/Employee');
const Order = require('../models/Order');
const SalesEvent = require('../models/SalesEvent');
const Review = require('../models/Review');
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
    specifications: 'Công suất: 60W, Diện tích sử dụng: 50m², Bộ lọc HEPA H13',
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
    specifications: 'Pin: 5200mAh, Thời gian hoạt động: 150 phút, Lập bản đồ laser',
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
    description: 'Nồi chiên không dầu đa năng với 8 chế độ nấu, tiết kiệm dầu mỡ',
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
    specifications: 'Áp suất: 15 bar, Bình chứa nước: 1.8L, Bình sữa: 0.5L',
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
    specifications: 'Độ phân giải: 4K UHD, HDR: Quantum HDR, Âm thanh: 2.2.2CH',
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
    description: 'Tủ lạnh side by side với công nghệ Inverter, tiết kiệm điện',
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
    specifications: 'Dung tích: 668L, Công nghệ: Inverter, Cửa: Side by Side',
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
    description: 'Máy giặt cửa trước với công nghệ Steam, diệt khuẩn hiệu quả',
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
    specifications: 'Khối lượng giặt: 9kg, Công nghệ: Steam, Cửa: Trước',
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
    description: 'Lò vi sóng digital với 25 chế độ nấu, nướng đa năng',
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
    specifications: 'Công suất: 1000W, Dung tích: 27L, Chế độ: 25 chế độ',
    warranty: '12 tháng',
    sku: 'PANASONIC-MICRO-001',
    supplier: 'Panasonic Vietnam',
    barcode: '8858990123456',
    tags: ['lò vi sóng', 'digital', 'panasonic'],
    featured: false,
    isActive: true
  },
  {
    name: 'Điều Hòa Inverter',
    description: 'Điều hòa inverter 1 chiều, tiết kiệm điện, làm lạnh nhanh',
    price: 8990000,
    originalPrice: 9990000,
    discount: 10,
    stock: 35,
    soldCount: 89,
    category: 'Điện Gia Dụng',
    brand: 'Daikin',
    image: 'https://source.unsplash.com/400x400/?air-conditioner',
    images: [
      'https://source.unsplash.com/400x400/?air-conditioner',
      'https://source.unsplash.com/400x400/?air-conditioner-2'
    ],
    rating: 4.7,
    reviewCount: 289,
    specifications: 'Công suất: 12000 BTU, Công nghệ: Inverter, Loại: 1 chiều',
    warranty: '24 tháng',
    sku: 'DAIKIN-AC-001',
    supplier: 'Daikin Vietnam',
    barcode: '4901234567890',
    tags: ['điều hòa', 'inverter', 'daikin'],
    featured: true,
    isActive: true
  },
  {
    name: 'Bếp Từ Đôi',
    description: 'Bếp từ đôi với công nghệ cảm ứng, an toàn và tiết kiệm',
    price: 5990000,
    originalPrice: 6990000,
    discount: 14,
    stock: 45,
    soldCount: 112,
    category: 'Nhà Bếp',
    brand: 'Bosch',
    image: 'https://source.unsplash.com/400x400/?induction-cooker',
    images: [
      'https://source.unsplash.com/400x400/?induction-cooker',
      'https://source.unsplash.com/400x400/?induction-cooker-2'
    ],
    rating: 4.6,
    reviewCount: 198,
    specifications: 'Công suất: 2 x 2000W, Cảm ứng: Touch, An toàn: Tự động tắt',
    warranty: '24 tháng',
    sku: 'BOSCH-COOKER-001',
    supplier: 'Bosch Vietnam',
    barcode: '4041234567890',
    tags: ['bếp từ', 'đôi', 'bosch'],
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
  },
  {
    username: 'employee1',
    fullName: 'Trần Thị B',
    email: 'employee1@example.com',
    password: 'employee123',
    role: 'employee',
    phone: '0123456788',
    isActive: true
  }
];

// Sample customers data
const sampleCustomers = [
  {
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    type: 'retail',
    creditLimit: 5000000,
    balance: 0,
    notes: 'Khách hàng VIP',
    lastPurchaseDate: new Date('2024-01-15'),
    totalPurchases: 15000000
  },
  {
    name: 'Trần Thị Bình',
    email: 'tranthibinh@gmail.com',
    phone: '0901234568',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
    type: 'retail',
    creditLimit: 3000000,
    balance: 500000,
    notes: 'Khách hàng thường xuyên',
    lastPurchaseDate: new Date('2024-01-10'),
    totalPurchases: 8000000
  },
  {
    name: 'Lê Văn Cường',
    email: 'levancuong@gmail.com',
    phone: '0901234569',
    address: '789 Đường DEF, Quận 7, TP.HCM',
    type: 'wholesale',
    creditLimit: 20000000,
    balance: 0,
    notes: 'Đại lý bán buôn',
    lastPurchaseDate: new Date('2024-01-20'),
    totalPurchases: 50000000
  },
  {
    name: 'Phạm Thị Dung',
    email: 'phamthidung@gmail.com',
    phone: '0901234570',
    address: '321 Đường GHI, Quận 10, TP.HCM',
    type: 'retail',
    creditLimit: 2000000,
    balance: 1000000,
    notes: 'Khách hàng mới',
    lastPurchaseDate: new Date('2024-01-05'),
    totalPurchases: 3000000
  },
  {
    name: 'Hoàng Văn Em',
    email: 'hoangvanem@gmail.com',
    phone: '0901234571',
    address: '654 Đường JKL, Quận 5, TP.HCM',
    type: 'wholesale',
    creditLimit: 15000000,
    balance: 2000000,
    notes: 'Đại lý phân phối',
    lastPurchaseDate: new Date('2024-01-18'),
    totalPurchases: 35000000
  }
];

// Sample employees data
const sampleEmployees = [
  {
    name: 'Nguyễn Thị Phương',
    email: 'nguyenthiphuong@company.com',
    phone: '0901234572',
    position: 'Nhân viên bán hàng',
    department: 'Kinh doanh'
  },
  {
    name: 'Trần Văn Hùng',
    email: 'tranvanhung@company.com',
    phone: '0901234573',
    position: 'Quản lý kho',
    department: 'Hậu cần'
  },
  {
    name: 'Lê Thị Mai',
    email: 'lethimai@company.com',
    phone: '0901234574',
    position: 'Kế toán',
    department: 'Tài chính'
  },
  {
    name: 'Phạm Văn Nam',
    email: 'phamvannam@company.com',
    phone: '0901234575',
    position: 'Nhân viên marketing',
    department: 'Marketing'
  },
  {
    name: 'Hoàng Thị Lan',
    email: 'hoangthilan@company.com',
    phone: '0901234576',
    position: 'Nhân viên chăm sóc khách hàng',
    department: 'CSKH'
  }
];

// Sample sales events data with new structure
const sampleSalesEvents = [
  {
    title: 'Siêu Sale Black Friday',
    description: 'Chương trình khuyến mãi lớn nhất năm với giảm giá lên đến 70% cho tất cả sản phẩm',
    shortDescription: 'Giảm giá lên đến 70%',
    image: 'https://source.unsplash.com/800x400/?black-friday',
    bannerImage: 'https://source.unsplash.com/1200x300/?sale-banner',
    startDate: new Date('2024-11-25'),
    endDate: new Date('2024-11-30'),
    type: 'promotion',
    status: 'active',
    location: 'Tất cả chi nhánh',
    participants: ['Marketing Team', 'Sales Team'],
    maxParticipants: 10000,
    budget: 50000000,
    notes: 'Chuẩn bị quảng cáo và inventory',
    discountPercentage: 70,
    isPublic: true,
    priority: 1
  },
  {
    title: 'Họp Đánh Giá Tháng 1',
    description: 'Họp đánh giá kết quả kinh doanh tháng 1 và kế hoạch tháng 2',
    shortDescription: 'Đánh giá kinh doanh',
    image: 'https://source.unsplash.com/800x400/?meeting',
    bannerImage: 'https://source.unsplash.com/1200x300/?business-meeting',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-01'),
    type: 'meeting',
    status: 'inactive',
    location: 'Phòng họp chính',
    participants: ['Ban lãnh đạo', 'Quản lý các phòng ban'],
    maxParticipants: 20,
    budget: 0,
    notes: 'Đã hoàn thành với kết quả tốt',
    isPublic: false,
    priority: 3
  },
  {
    title: 'Sự Kiện Ra Mắt Sản Phẩm Mới',
    description: 'Ra mắt dòng sản phẩm thông minh mới nhất với công nghệ AI tiên tiến',
    shortDescription: 'Khám phá công nghệ mới',
    image: 'https://source.unsplash.com/800x400/?product-launch',
    bannerImage: 'https://source.unsplash.com/1200x300/?tech-launch',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-15'),
    type: 'event',
    status: 'active',
    location: 'Trung tâm thương mại ABC',
    participants: ['Marketing Team', 'PR Team', 'Sales Team'],
    maxParticipants: 500,
    budget: 30000000,
    notes: 'Đang chuẩn bị logistics và media',
    isPublic: true,
    priority: 2
  }
];

// Sample orders data with new structure
const sampleOrders = [
  {
    orderNumber: 'ORD-20240101-001',
    customer: 'Nguyễn Văn An',
    customerEmail: 'nguyenvanan@gmail.com',
    customerPhone: '0901234567',
    date: new Date('2024-01-01'),
    totalAmount: 15000000,
    subtotal: 15000000,
    tax: 0,
    shippingFee: 0,
    discount: 0,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Chuyển khoản ngân hàng',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    billingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    note: 'Giao hàng trong giờ hành chính',
    trackingNumber: 'VN123456789',
    estimatedDelivery: new Date('2024-01-03'),
    actualDelivery: new Date('2024-01-03'),
    items: [
      {
        productId: 'product1',
        name: 'Máy Lọc Không Khí Samsung',
        price: 4990000,
        quantity: 2,
        image: 'https://source.unsplash.com/400x400/?air-purifier',
        brand: 'Samsung',
        sku: 'SAMSUNG-AIR-001'
      },
      {
        productId: 'product2',
        name: 'Robot Hút Bụi Thông Minh',
        price: 7990000,
        quantity: 1,
        image: 'https://source.unsplash.com/400x400/?robot-vacuum',
        brand: 'Xiaomi',
        sku: 'XIAOMI-ROBOT-001'
      }
    ]
  },
  {
    orderNumber: 'ORD-20240105-002',
    customer: 'Trần Thị Bình',
    customerEmail: 'tranthibinh@gmail.com',
    customerPhone: '0901234568',
    date: new Date('2024-01-05'),
    totalAmount: 8000000,
    subtotal: 8000000,
    tax: 0,
    shippingFee: 0,
    discount: 0,
    status: 'processing',
    paymentStatus: 'pending',
    paymentMethod: 'Thanh toán khi nhận hàng',
    shippingAddress: '456 Đường XYZ, Quận 3, TP.HCM',
    billingAddress: '456 Đường XYZ, Quận 3, TP.HCM',
    note: 'Gọi trước khi giao hàng',
    items: [
      {
        productId: 'product3',
        name: 'Nồi Chiên Không Dầu',
        price: 2490000,
        quantity: 1,
        image: 'https://source.unsplash.com/400x400/?air-fryer',
        brand: 'Philips',
        sku: 'PHILIPS-FRYER-001'
      },
      {
        productId: 'product4',
        name: 'Máy Pha Cà Phê Tự Động',
        price: 5990000,
        quantity: 1,
        image: 'https://source.unsplash.com/400x400/?coffee-machine',
        brand: 'DeLonghi',
        sku: 'DELONGHI-COFFEE-001'
      }
    ]
  },
  {
    orderNumber: 'ORD-20240110-003',
    customer: 'Lê Văn Cường',
    customerEmail: 'levancuong@gmail.com',
    customerPhone: '0901234569',
    date: new Date('2024-01-10'),
    totalAmount: 25000000,
    subtotal: 25000000,
    tax: 0,
    shippingFee: 0,
    discount: 0,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Chuyển khoản ngân hàng',
    shippingAddress: '789 Đường DEF, Quận 7, TP.HCM',
    billingAddress: '789 Đường DEF, Quận 7, TP.HCM',
    note: 'Giao hàng cẩn thận',
    trackingNumber: 'VN987654321',
    estimatedDelivery: new Date('2024-01-12'),
    actualDelivery: new Date('2024-01-12'),
    items: [
      {
        productId: 'product5',
        name: 'Smart TV QLED 65"',
        price: 35900000,
        quantity: 1,
        image: 'https://source.unsplash.com/400x400/?smart-tv',
        brand: 'Samsung',
        sku: 'SAMSUNG-TV-001'
      }
    ]
  }
];

// Sample reviews data with new structure
const sampleReviews = [
  {
    customerName: 'Nguyễn Văn An',
    customerAvatar: 'https://source.unsplash.com/100x100/?portrait',
    rating: 5,
    title: 'Sản phẩm chất lượng cao',
    content: 'Sản phẩm chất lượng rất tốt, giao hàng nhanh chóng. Rất hài lòng với dịch vụ!',
    images: ['https://source.unsplash.com/400x400/?product'],
    isVerified: true,
    isHelpful: 12,
    status: 'approved',
    reply: 'Cảm ơn bạn đã tin tưởng chúng tôi!',
    createdAt: new Date('2024-01-02')
  },
  {
    customerName: 'Trần Thị Bình',
    customerAvatar: 'https://source.unsplash.com/100x100/?woman',
    rating: 4,
    title: 'Đúng như mô tả',
    content: 'Sản phẩm đúng như mô tả, nhân viên tư vấn nhiệt tình. Sẽ mua lại!',
    images: [],
    isVerified: true,
    isHelpful: 8,
    status: 'approved',
    reply: 'Chúng tôi rất vui khi được phục vụ bạn!',
    createdAt: new Date('2024-01-06')
  },
  {
    customerName: 'Lê Văn Cường',
    customerAvatar: 'https://source.unsplash.com/100x100/?man',
    rating: 5,
    title: 'TV chất lượng cao',
    content: 'TV chất lượng cao, hình ảnh sắc nét. Đóng gói cẩn thận, giao hàng đúng hẹn.',
    images: ['https://source.unsplash.com/400x400/?tv'],
    isVerified: true,
    isHelpful: 15,
    status: 'approved',
    reply: 'Cảm ơn bạn đã đánh giá tích cực!',
    createdAt: new Date('2024-01-12')
  }
];

const seedAdminData = async () => {
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
    await Customer.deleteMany({});
    await Employee.deleteMany({});
    await Order.deleteMany({});
    await SalesEvent.deleteMany({});
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

    // Tạo map tên sản phẩm -> _id
    const productNameToId = {};
    createdProducts.forEach(p => { productNameToId[p.name] = p._id; });

    // Chuẩn hóa productId trong orders
    const ordersWithProductIds = sampleOrders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        productId: productNameToId[item.name] || null
      }))
    }));

    // Insert customers
    const createdCustomers = await Customer.insertMany(sampleCustomers);
    console.log(`Created ${createdCustomers.length} customers`);

    // Insert employees
    const createdEmployees = await Employee.insertMany(sampleEmployees);
    console.log(`Created ${createdEmployees.length} employees`);

    // Insert sales events
    const adminUser = await User.findOne({ role: 'admin' });
    const salesEventsWithCreator = sampleSalesEvents.map(event => ({
      ...event,
      createdBy: adminUser._id
    }));
    const createdSalesEvents = await SalesEvent.insertMany(salesEventsWithCreator);
    console.log(`Created ${createdSalesEvents.length} sales events`);

    // Insert orders with userId
    const user1 = await User.findOne({ username: 'user1' });
    const ordersWithUserIds = ordersWithProductIds.map(order => ({
      ...order,
      userId: user1._id
    }));
    const createdOrders = await Order.insertMany(ordersWithUserIds);
    console.log(`Created ${createdOrders.length} orders`);

    // Insert reviews with productId and userId
    const orderNumberToId = {};
    createdOrders.forEach(o => { orderNumberToId[o.orderNumber] = o._id; });
    
    // Map product names to IDs for reviews
    const reviewsWithIds = sampleReviews.map((review, index) => {
      const order = createdOrders[index % createdOrders.length];
      const orderItem = order.items[0]; // Use first item from order
      return {
        ...review,
        productId: orderItem.productId,
        userId: user1._id,
        orderId: order._id
      };
    });
    
    const createdReviews = await Review.insertMany(reviewsWithIds);
    console.log(`Created ${createdReviews.length} reviews`);

    console.log('\n=== ADMIN DATA SEEDING COMPLETED ===');
    console.log('\nSample accounts:');
    console.log('Admin: admin / admin123');
    console.log('User: user1 / user123');
    console.log('Employee: employee1 / employee123');
    
    console.log('\nDatabase Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Products: ${createdProducts.length}`);
    console.log(`- Customers: ${createdCustomers.length}`);
    console.log(`- Employees: ${createdEmployees.length}`);
    console.log(`- Orders: ${createdOrders.length}`);
    console.log(`- Sales Events: ${createdSalesEvents.length}`);
    console.log(`- Reviews: ${createdReviews.length}`);

  } catch (error) {
    console.error('Error seeding admin data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the seed function
seedAdminData(); 