# 👥 Tự Động Quản Lý Khách Hàng

## 🎯 Tổng quan

Tính năng tự động thêm và cập nhật thông tin khách hàng khi có user mới đặt hàng. Hệ thống sẽ tự động:

- ✅ **Tự động thêm khách hàng mới** khi có đơn hàng đầu tiên
- ✅ **Cập nhật thông tin khách hàng** khi có đơn hàng tiếp theo
- ✅ **Theo dõi lịch sử mua hàng** và số lượng đơn hàng
- ✅ **Phân loại khách hàng** VIP, mới, không hoạt động
- ✅ **Thống kê chi tiết** khách hàng cho admin

## 🏗️ Kiến trúc

### Backend Services

#### 1. Customer Auto Service (`server/src/services/customerAutoService.js`)
```javascript
// Các function chính:
- autoAddCustomerFromOrder(orderData, userEmail) // Tự động thêm/cập nhật khách hàng
- updateCustomerFromOrderStatus(orderId, newStatus) // Cập nhật từ trạng thái đơn hàng
- getCustomerStats() // Thống kê khách hàng
- getVIPCustomers(limit) // Khách hàng VIP
- getNewCustomers(limit) // Khách hàng mới
- getInactiveCustomers(days) // Khách hàng không hoạt động
```

#### 2. Order Routes (`server/src/routes/orders.js`)
```javascript
// Tự động thêm khách hàng khi:
- POST /api/orders/user // Tạo đơn hàng mới
- PUT /api/orders/:id // Cập nhật trạng thái đơn hàng
```

#### 3. Customer Routes (`server/src/routes/customers.js`)
```javascript
// API cho admin:
- GET /api/customers/stats // Thống kê khách hàng
- GET /api/customers/vip // Khách hàng VIP
- GET /api/customers/new // Khách hàng mới
- GET /api/customers/inactive // Khách hàng không hoạt động
```

### Frontend Components

#### 1. Customer Stats (`admin/src/components/CustomerStats.tsx`)
- Hiển thị thống kê khách hàng với tabs
- Danh sách khách hàng VIP, mới, không hoạt động
- Real-time updates

#### 2. Dashboard Integration (`admin/src/pages/Dashboard.tsx`)
- Tích hợp thống kê khách hàng vào dashboard

## 🔄 Logic Hoạt Động

### Khi tạo đơn hàng mới:
```javascript
// Kiểm tra khách hàng đã tồn tại chưa
if (customer exists) {
  // Cập nhật khách hàng hiện có
  - Tăng totalPurchases
  - Cập nhật lastPurchaseDate
  - Cập nhật address nếu khác
} else {
  // Tạo khách hàng mới
  - Lấy thông tin từ User model
  - Tạo Customer record mới
  - Ghi chú: "Tự động tạo từ đơn hàng XXX"
}
```

### Khi cập nhật trạng thái đơn hàng:
```javascript
// Trạng thái: "Đã giao hàng" hoặc "Đã hoàn thành"
- Cập nhật lastPurchaseDate
- Thêm ghi chú về trạng thái đơn hàng
```

### Phân loại khách hàng:
- **VIP**: Có totalPurchases > 0, sắp xếp theo số đơn hàng
- **Mới**: Sắp xếp theo ngày tạo (createdAt)
- **Không hoạt động**: Không mua hàng trong X ngày

## 📊 Thống Kê Khách Hàng

### Categories:
- **Tổng khách hàng**: Tất cả khách hàng trong hệ thống
- **Đang hoạt động**: isActive = true
- **Mới tháng này**: createdAt trong tháng hiện tại
- **Có đơn hàng**: totalPurchases > 0
- **Không hoạt động**: totalCustomers - activeCustomers

### API Response:
```json
{
  "totalCustomers": 150,
  "activeCustomers": 120,
  "newCustomersThisMonth": 25,
  "customersWithOrders": 100,
  "inactiveCustomers": 30
}
```

## 🎨 UI/UX Features

### 1. Dashboard Admin
- **Thống kê tổng quan** với cards màu sắc
- **Tabs navigation** cho các loại khách hàng
- **Tỷ lệ phần trăm** cho từng loại
- **Cảnh báo** khách hàng không hoạt động

### 2. Customer Tabs
- **Tổng quan**: Thống kê và tỷ lệ
- **Khách VIP**: Top khách hàng mua nhiều
- **Khách mới**: Khách hàng mới tham gia
- **Không hoạt động**: Khách hàng cần liên hệ

### 3. Table Features
- **Sắp xếp** theo tiêu chí khác nhau
- **Màu sắc** cho trạng thái
- **Chips** hiển thị số liệu
- **Real-time updates**

## 🧪 Testing

### Script Test (`server/src/scripts/testCustomerAuto.js`)
```bash
# Chạy test
npm run test-customer-auto
```

### Test Cases:
1. **Tạo đơn hàng cho khách mới** → Tạo customer record
2. **Tạo đơn hàng thứ 2** → Cập nhật thông tin
3. **Thống kê khách hàng** → Kiểm tra số liệu
4. **Khách hàng VIP** → Lấy top khách hàng
5. **Khách hàng mới** → Lấy danh sách mới
6. **Khách không hoạt động** → Lấy danh sách inactive

## 🚀 Sử dụng

### 1. Khởi động hệ thống
```bash
# Backend
cd server && npm run dev

# Admin Frontend
cd admin && npm start
```

### 2. Xem thống kê khách hàng
- Mở http://localhost:3001
- Đăng nhập admin
- Vào Dashboard → Xem "Thống Kê Khách Hàng"

### 3. Test tính năng
```bash
# Tạo đơn hàng từ user frontend
# Xem cập nhật trong admin dashboard
# Hoặc chạy test script
cd server && npm run test-customer-auto
```

## 🔧 Cấu hình

### Environment Variables:
```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/sales_management
```

### Customer Model Fields:
```javascript
{
  name: String,           // Tên khách hàng
  email: String,          // Email (unique)
  phone: String,          // Số điện thoại
  address: String,        // Địa chỉ
  type: String,           // 'retail' hoặc 'wholesale'
  totalPurchases: Number, // Tổng số đơn hàng
  lastPurchaseDate: Date, // Ngày mua hàng cuối
  isActive: Boolean,      // Trạng thái hoạt động
  notes: String           // Ghi chú
}
```

## 📈 Monitoring

### Logs:
```javascript
// Console logs khi cập nhật
console.log(`Đã cập nhật khách hàng hiện có: ${customer.name}`);
console.log(`Đã tạo khách hàng mới: ${customer.name}`);
console.log(`Đã cập nhật khách hàng ${customer.name} từ trạng thái đơn hàng`);
```

### Error Handling:
- Không throw error khi thêm/cập nhật khách hàng
- Log lỗi để debug
- Không ảnh hưởng đến việc tạo/cập nhật đơn hàng

## 🔄 Workflow

### User mua hàng:
1. User đăng ký/đăng nhập
2. User thêm sản phẩm vào giỏ hàng
3. User checkout và tạo đơn hàng
4. **Hệ thống tự động thêm/cập nhật khách hàng**
5. Admin xác nhận và giao hàng
6. **Hệ thống cập nhật thông tin khách hàng**

### Admin quản lý:
1. Xem thống kê khách hàng trong Dashboard
2. Kiểm tra khách hàng VIP để ưu đãi
3. Liên hệ khách hàng không hoạt động
4. Theo dõi khách hàng mới

## 🎯 Benefits

### Cho Admin:
- ✅ **Tự động quản lý** khách hàng
- ✅ **Phân loại khách hàng** VIP, mới, không hoạt động
- ✅ **Thống kê chi tiết** tỷ lệ khách hàng
- ✅ **Theo dõi lịch sử** mua hàng
- ✅ **Cảnh báo sớm** khách hàng cần chăm sóc

### Cho User:
- ✅ **Không cần đăng ký** thêm thông tin
- ✅ **Thông tin tự động** cập nhật
- ✅ **Trải nghiệm mượt mà** khi mua hàng

### Cho Hệ thống:
- ✅ **Tính nhất quán** dữ liệu khách hàng
- ✅ **Giảm lỗi** thao tác thủ công
- ✅ **Tối ưu hiệu suất** với auto-management

## 🔍 Customer Analytics

### VIP Customer Criteria:
- Số đơn hàng cao nhất
- Tổng giá trị mua hàng lớn
- Tần suất mua hàng đều đặn

### New Customer Metrics:
- Thời gian tham gia
- Đơn hàng đầu tiên
- Tốc độ tăng trưởng

### Inactive Customer Detection:
- Không mua hàng trong 30+ ngày
- Tần suất mua hàng giảm
- Cần chiến lược re-engagement

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready 