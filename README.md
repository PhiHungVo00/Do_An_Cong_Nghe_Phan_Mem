# 🏪 Hệ Thống Quản Lý Bán Hàng Thông Minh

## 📋 Tổng quan

Hệ thống quản lý bán hàng toàn diện với 4 thành phần chính:
- **Backend API** (Node.js + MongoDB)
- **Frontend User** (React + TypeScript)
- **Frontend Admin** (React + TypeScript)
- **Frontend Shipper** (React + TypeScript)

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

### 📦 Quản lý giao vận (Shipper)
- Xem, nhận, giao đơn hàng
- Theo dõi trạng thái đơn
- Lịch sử giao hàng

### 📊 Dashboard Admin
- Analytics dashboard
- Sales reports
- Customer management
- Product management
- Order processing

## 🏗️ Cấu trúc dự án

```
Do_An_Cong_Nghe_Phan_Mem/
├── server/                 # Backend API (Node.js, Express, MongoDB)
│   ├── src/
│   │   ├── models/        # MongoDB models (Order, User, Product...)
│   │   ├── routes/        # API routes (auth, orders, products...)
│   │   ├── middleware/    # Auth, error handling middleware
│   │   ├── services/      # Business logic, helpers
│   │   ├── assets/        # Ảnh mẫu, dữ liệu tĩnh
│   │   └── scripts/       # Database scripts, seeders
│   ├── package.json
│   └── ...
├── user/                  # Frontend User (React + TS)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Trang chính (Home, Product, Cart...)
│   │   ├── contexts/      # React Contexts
│   │   ├── services/      # API services
│   │   ├── assets/        # Ảnh, icon
│   │   ├── utils/         # Hàm tiện ích
│   │   ├── data/          # Dữ liệu mẫu
│   │   ├── layouts/       # Layouts
│   │   ├── types/         # TypeScript types
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── admin/                 # Frontend Admin (React + TS)
│   ├── src/
│   │   ├── components/    # UI components cho admin
│   │   ├── pages/         # Trang quản trị (Dashboard, Orders...)
│   │   ├── store/         # Redux store
│   │   ├── layouts/       # Layouts
│   │   ├── hooks/         # Custom hooks
│   │   ├── routes/        # Route config
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── shipper/               # Frontend Shipper (React + TS)
│   ├── src/
│   │   ├── api/           # API services cho shipper
│   │   ├── components/    # UI components cho shipper
│   │   ├── pages/         # Trang shipper (Đơn chờ nhận, Đang giao...)
│   │   ├── theme.ts       # Giao diện MUI
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── database/              # Database schema & sample data
│   ├── schema.sql         # SQL schema (tham khảo)
│   ├── sample_data.sql    # Dữ liệu mẫu
│   └── docs/              # ERD, mô tả DB
├── docs/                  # Documentation chi tiết
│   ├── INDEX.md           # Mục lục docs
│   ├── ...
├── .gitignore             # Ignore chung toàn dự án
├── README.md              # Hướng dẫn tổng thể
├── package.json           # Quản lý workspace
└── ...
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

# Shipper Frontend
cd shipper && npm install
```

### 2. Cấu hình môi trường
```bash
# Tạo file .env cho từng module nếu cần
# Ví dụ cho user:
echo "REACT_APP_API_URL=http://localhost:5000/api" > user/.env
# Tương tự cho admin, shipper nếu dùng biến môi trường riêng
```

### 3. Khởi động hệ thống
```bash
# Chạy script tự động
START_SYSTEM.bat

# Hoặc chạy thủ công
cd server && npm run dev
cd user && npm start
cd admin && npm start
cd shipper && npm start
```

## 📚 Documentation

- [docs/INDEX.md](docs/INDEX.md) - Tổng hợp tài liệu, hướng dẫn, troubleshooting, API, database...

## 🔧 Công nghệ sử dụng

### Backend
- Node.js, Express.js, MongoDB, JWT, Multer

### Frontend
- React 18, TypeScript, Material-UI, Redux Toolkit, Google Maps API

### Dev & Deploy
- npm, Create React App, ESLint, Prettier, Git

## 📞 Support
- **Email**: support@example.com
- **Documentation**: [docs/](docs/)
- **Issues**: GitHub Issues

---
**Made with ❤️ by Development Team** 