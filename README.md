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

### Server (Backend)

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo file .env với nội dung sau
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sales_management
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development

# Tạo tài khoản admin
npm run create-admin

# Khởi động server
npm run dev
```

### Ứng dụng người dùng (Frontend - User)

```bash
# Di chuyển vào thư mục user
cd user

# Cài đặt dependencies
npm install

# Khởi động ứng dụng
npm start
```

### Ứng dụng quản trị (Frontend - Admin)

```bash
# Di chuyển vào thư mục admin
cd admin

# Cài đặt dependencies
npm install

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
│   │   └── store/          # Redux store (if applicable)
│   └── package.json
│
└── admin/                  # Ứng dụng quản trị React.js
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Các trang
    │   ├── layouts/        # Layout components
    │   └── store/          # Redux store (if applicable)
    └── package.json
```

## Công nghệ sử dụng

### Frontend
- React.js với TypeScript
- Material-UI cho giao diện
- Redux Toolkit cho quản lý state
- React Router cho điều hướng
- Chart.js cho biểu đồ

### Backend
- Node.js với Express
- MongoDB với Mongoose
- JWT cho xác thực
- Bcrypt cho mã hóa

## Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

MIT License - xem [LICENSE](LICENSE) để biết thêm chi tiết 