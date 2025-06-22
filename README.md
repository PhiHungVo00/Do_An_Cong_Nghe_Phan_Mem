# Hệ thống Quản lý Bán hàng

Ứng dụng web quản lý bán hàng được xây dựng với React.js và Node.js, cung cấp giao diện người dùng hiện đại và các tính năng quản lý toàn diện.

## Tính năng chính

### Quản lý sản phẩm
- Thêm, sửa, xóa sản phẩm
- Quản lý kho hàng
- Theo dõi tồn kho
- Phân loại sản phẩm

### Quản lý đơn hàng
- Xử lý đơn hàng
- Theo dõi trạng thái
- Lịch sử đơn hàng
- Báo cáo doanh số

### Quản lý khách hàng
- Thông tin khách hàng
- Lịch sử mua hàng
- Phân loại khách hàng
- Chăm sóc khách hàng

### Báo cáo và thống kê
- Doanh thu theo thời gian
- Phân tích bán hàng
- Báo cáo tồn kho
- Thống kê truy cập

## Yêu cầu hệ thống

- Node.js >= 14.0.0
- MongoDB >= 4.0.0
- npm hoặc yarn

## Cài đặt và Chạy

### 1. Cài đặt Server (Backend)

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo file .env với nội dung sau
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sales_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Seed dữ liệu mẫu
npm run seed-data

# Khởi động server
npm run dev
```

### 2. Cài đặt Ứng dụng người dùng (Frontend - User)

```bash
# Di chuyển vào thư mục user
cd user

# Cài đặt dependencies
npm install

# Tạo file .env (nếu cần)
REACT_APP_API_URL=http://localhost:5000/api

# Khởi động ứng dụng
npm start
```

### 3. Cài đặt Ứng dụng quản trị (Frontend - Admin)

```bash
# Di chuyển vào thư mục admin
cd admin

# Cài đặt dependencies
npm install

# Tạo file .env (nếu cần)
REACT_APP_API_URL=http://localhost:5000/api

# Khởi động ứng dụng
npm start
```

## Tài khoản demo

```
Người dùng Admin:
Email: admin@example.com
Mật khẩu: admin123

Người dùng thường:
Email: user@example.com
Mật khẩu: user123
```

⚠️ Lưu ý: Hãy đổi mật khẩu ngay sau khi đăng nhập lần đầu

## API Endpoints

### Public Endpoints (Không cần authentication)
- `GET /api/products/public` - Lấy danh sách sản phẩm
- `GET /api/products/public/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/public/featured` - Lấy sản phẩm nổi bật
- `GET /api/products/public/categories/all` - Lấy danh mục sản phẩm
- `GET /api/products/public/brands/all` - Lấy thương hiệu sản phẩm
- `GET /api/sales-events/public` - Lấy sự kiện bán hàng
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### User Endpoints (Cần authentication)
- `GET /api/orders/user` - Lấy đơn hàng của user
- `POST /api/orders/user` - Tạo đơn hàng mới
- `GET /api/orders/user/:id` - Lấy chi tiết đơn hàng
- `PUT /api/customers/profile` - Cập nhật thông tin cá nhân
- `GET /api/customers/profile` - Lấy thông tin cá nhân
- `POST /api/reviews` - Tạo đánh giá sản phẩm
- `GET /api/reviews/product/:id` - Lấy đánh giá sản phẩm

### Admin Endpoints (Cần admin authentication)
- `GET /api/products` - Quản lý sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `GET /api/orders` - Quản lý đơn hàng
- `PUT /api/orders/:id` - Cập nhật đơn hàng
- `DELETE /api/orders/:id` - Xóa đơn hàng
- `GET /api/customers` - Quản lý khách hàng
- `GET /api/employees` - Quản lý nhân viên

## Cấu trúc thư mục

```
.
├── server/                  # Server Node.js
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Middleware
│   │   └── scripts/        # Scripts tiện ích
│   └── package.json
│
├── user/                   # Ứng dụng người dùng React.js
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Các trang
│   │   ├── layouts/        # Layout components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   └── package.json
│
└── admin/                  # Ứng dụng quản trị React.js
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Các trang
    │   ├── layouts/        # Layout components
    │   ├── store/          # Redux store
    │   └── hooks/          # Custom hooks
    └── package.json
```

## Công nghệ sử dụng

### Frontend
- React.js với TypeScript
- Material-UI cho giao diện
- Redux Toolkit cho quản lý state (Admin)
- React Router cho điều hướng
- Chart.js cho biểu đồ

### Backend
- Node.js với Express
- MongoDB với Mongoose
- JWT cho xác thực
- Bcrypt cho mã hóa
- CORS cho cross-origin requests

## Kết nối API

### User Frontend
- Sử dụng `services/api.ts` để kết nối với server
- Tự động lưu token vào localStorage
- Hỗ trợ authentication và authorization
- Real-time updates cho giỏ hàng và đơn hàng

### Admin Frontend
- Sử dụng Redux Toolkit để quản lý state
- Axios cho HTTP requests
- Protected routes với authentication
- Real-time dashboard với charts

## Troubleshooting

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB service
sudo systemctl status mongod

# Khởi động MongoDB
sudo systemctl start mongod
```

### Lỗi CORS
- Đảm bảo CORS_ORIGIN trong .env đúng với port frontend
- Kiểm tra URL API trong frontend

### Lỗi Authentication
- Kiểm tra JWT_SECRET trong .env
- Đảm bảo token được gửi đúng format
- Kiểm tra role của user

## Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

MIT License - xem [LICENSE](LICENSE) để biết thêm chi tiết 