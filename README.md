# 🏪 Hệ Thống Quản Lý Bán Hàng Thông Minh

## 📋 Tổng quan

Hệ thống quản lý bán hàng toàn diện với 3 thành phần chính:
- **Backend API** (Node.js + MongoDB)
- **Frontend User** (React + TypeScript) 
- **Frontend Admin** (React + TypeScript)

## 🚀 Tính năng chính

### 🛍️ Quản lý sản phẩm
- Danh mục sản phẩm đa dạng
- Tìm kiếm và lọc sản phẩm
- Chi tiết sản phẩm với hình ảnh
- Đánh giá và review

### 🛒 Giỏ hàng & Đặt hàng
- Giỏ hàng thông minh
- Hệ thống địa chỉ tiên tiến
- Google Maps integration
- Theo dõi đơn hàng

### 🎯 Khuyến mãi & Sự kiện
- Live events streaming
- Challenges và gamification
- Sales events management
- Coupon system

### 👥 Quản lý khách hàng
- Đăng ký/Đăng nhập
- Profile management
- Chat support
- Order history

### 📊 Dashboard Admin
- Analytics dashboard
- Sales reports
- Customer management
- Product management
- Order processing

## 🏗️ Cấu trúc dự án

```
Do_An_Cong_Nghe_Phan_Mem/
├── server/                 # Backend API
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── scripts/       # Database scripts
│   └── package.json
├── user/                   # Frontend User
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API services
│   └── package.json
├── admin/                  # Frontend Admin
│   ├── src/
│   │   ├── components/    # Admin components
│   │   ├── pages/         # Admin pages
│   │   └── store/         # Redux store
│   └── package.json
├── database/              # Database schema & docs
├── docs/                  # Documentation
└── README.md
```

## 🚀 Khởi động nhanh

### 1. Cài đặt dependencies
```bash
# Backend
cd server && npm install

# User Frontend
cd user && npm install

# Admin Frontend
cd admin && npm install
```

### 2. Cấu hình môi trường
```bash
# Tạo file .env trong thư mục user/
echo "REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key" > user/.env
echo "REACT_APP_API_URL=http://localhost:5000/api" >> user/.env
```

### 3. Khởi động hệ thống
```bash
# Chạy script tự động
START_SYSTEM.bat

# Hoặc chạy thủ công
cd server && npm run dev
cd user && npm start
cd admin && npm start
```

## 📚 Documentation

### 📖 Hướng dẫn chi tiết
- [📚 Documentation Index](docs/INDEX.md) - Tổng hợp tất cả documentation
- [📋 Tổng quan dự án](docs/README.md) - Kiến trúc và API documentation
- [🗺️ Tính năng địa chỉ](docs/ADDRESS_FEATURE.md) - Hệ thống địa chỉ thông minh
- [🔧 Cấu hình Google Maps](docs/GOOGLE_MAPS_SETUP.md) - Setup Google Maps API
- [🧪 Test hệ thống](docs/TEST_ADDRESS_SYSTEM.md) - Hướng dẫn test
- [🐛 Khắc phục lỗi](docs/GOOGLE_MAPS_TROUBLESHOOTING.md) - Troubleshooting

### 🛠️ API Documentation
- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT Token
- **Database**: MongoDB

### 📊 Database Schema
- Users, Products, Orders, Customers
- Reviews, Sales Events, Challenges
- Address system với phân cấp hành chính

## 🎯 Tính năng nổi bật

### 🗺️ Hệ thống địa chỉ tiên tiến
- ✅ Dữ liệu 63 tỉnh/thành Việt Nam
- ✅ Cascading dropdown filters
- ✅ Google Maps integration
- ✅ GPS location support
- ✅ Address parsing tự động

### 🎮 Gamification
- ✅ Challenges và rewards
- ✅ Live events streaming
- ✅ Customer engagement
- ✅ Loyalty programs

### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Progressive Web App
- ✅ Cross-platform support
- ✅ Modern UI/UX

## 🔧 Công nghệ sử dụng

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI
- **State Management**: Redux Toolkit
- **Maps**: Google Maps API

### Development
- **Package Manager**: npm
- **Build Tool**: Create React App
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

## 🚀 Deployment

### Development
```bash
# Backend
cd server && npm run dev

# User Frontend
cd user && npm start

# Admin Frontend  
cd admin && npm start
```

### Production
```bash
# Build frontend
cd user && npm run build
cd admin && npm run build

# Deploy backend
cd server && npm start
```

## 📞 Support

### 🔧 Troubleshooting
- [Khắc phục lỗi Google Maps](docs/GOOGLE_MAPS_TROUBLESHOOTING.md)
- [Test hệ thống](docs/TEST_ADDRESS_SYSTEM.md)
- [Cấu hình môi trường](docs/GOOGLE_MAPS_SETUP.md)

### 📧 Contact
- **Email**: support@example.com
- **Documentation**: [docs/](docs/)
- **Issues**: GitHub Issues

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

**Made with ❤️ by Development Team** 