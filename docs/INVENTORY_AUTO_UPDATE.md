# 📦 Tự Động Cập Nhật Tồn Kho

## 🎯 Tổng quan

Tính năng tự động cập nhật tồn kho, số lượng đã bán và trạng thái sản phẩm khi có user mua hàng. Hệ thống sẽ tự động:

- ✅ Giảm tồn kho khi đơn hàng được tạo
- ✅ Tăng số lượng đã bán khi đơn hàng hoàn thành
- ✅ Cập nhật trạng thái sản phẩm dựa trên tồn kho
- ✅ Tăng lại tồn kho khi đơn hàng bị hủy
- ✅ Hiển thị thống kê tồn kho cho admin

## 🏗️ Kiến trúc

### Backend Services

#### 1. Product Update Service (`server/src/services/productUpdateService.js`)
```javascript
// Các function chính:
- updateProductInventory(items, orderStatus) // Cập nhật tồn kho
- updateProductStatus(productId) // Cập nhật trạng thái sản phẩm
- updateAllProductStatus() // Cập nhật tất cả sản phẩm
- getInventoryStats() // Lấy thống kê tồn kho
```

#### 2. Order Routes (`server/src/routes/orders.js`)
```javascript
// Tự động cập nhật khi:
- POST /api/orders/user // Tạo đơn hàng mới
- PUT /api/orders/:id // Cập nhật trạng thái đơn hàng
```

#### 3. Product Routes (`server/src/routes/products.js`)
```javascript
// API cho admin:
- GET /api/products/inventory/stats // Thống kê tồn kho
- POST /api/products/inventory/update-status // Cập nhật trạng thái
- GET /api/products/inventory/low-stock // Sản phẩm sắp hết hàng
- GET /api/products/inventory/out-of-stock // Sản phẩm hết hàng
```

### Frontend Components

#### 1. Inventory Stats (`admin/src/components/InventoryStats.tsx`)
- Hiển thị thống kê tồn kho
- Cập nhật trạng thái sản phẩm
- Cảnh báo sản phẩm sắp hết hàng

#### 2. Products Page (`admin/src/pages/Products.tsx`)
- Hiển thị màu sắc tồn kho
- Cập nhật real-time

## 🔄 Logic Cập Nhật

### Khi tạo đơn hàng mới:
```javascript
// Trạng thái: "Đang xử lý"
- Giảm tồn kho: stock = stock - quantity
- Cập nhật trạng thái sản phẩm:
  + stock = 0 → isActive = false (Hết hàng)
  + stock ≤ 5 → isActive = true (Sắp hết hàng)
  + stock > 5 → isActive = true (Có hàng)
```

### Khi đơn hàng hoàn thành:
```javascript
// Trạng thái: "Đã giao hàng" hoặc "Hoàn thành"
- Tăng số lượng đã bán: soldCount = soldCount + quantity
```

### Khi đơn hàng bị hủy:
```javascript
// Trạng thái: "Đã hủy" hoặc "Hoàn trả"
- Tăng lại tồn kho: stock = stock + quantity
- Giảm số lượng đã bán: soldCount = soldCount - quantity
- Cập nhật trạng thái: isActive = true
```

## 📊 Thống Kê Tồn Kho

### Categories:
- **Tổng sản phẩm**: Tất cả sản phẩm trong hệ thống
- **Có hàng**: Sản phẩm có stock > 5 và isActive = true
- **Sắp hết hàng**: Sản phẩm có 0 < stock ≤ 5 và isActive = true
- **Hết hàng**: Sản phẩm có stock = 0 và isActive = false

### API Response:
```json
{
  "totalProducts": 150,
  "inStock": 120,
  "lowStock": 20,
  "outOfStock": 10
}
```

## 🎨 UI/UX Features

### 1. Dashboard Admin
- **Thống kê tồn kho** với cards màu sắc
- **Tỷ lệ phần trăm** cho từng loại
- **Cảnh báo** sản phẩm sắp hết hàng
- **Nút cập nhật** trạng thái tất cả sản phẩm

### 2. Products Table
- **Màu sắc tồn kho**:
  - 🔴 Đỏ: Hết hàng (stock = 0)
  - 🟡 Vàng: Sắp hết hàng (stock ≤ 5)
  - 🟢 Xanh: Có hàng (stock > 5)

### 3. Real-time Updates
- Tự động cập nhật khi có đơn hàng mới
- Refresh data khi cần thiết

## 🧪 Testing

### Script Test (`server/src/scripts/testInventoryUpdate.js`)
```bash
# Chạy test
npm run test-inventory
```

### Test Cases:
1. **Tạo đơn hàng mới** → Giảm tồn kho
2. **Giao hàng** → Tăng số lượng đã bán
3. **Hủy đơn hàng** → Tăng lại tồn kho
4. **Kiểm tra trạng thái** → Cập nhật isActive

## 🚀 Sử dụng

### 1. Khởi động hệ thống
```bash
# Backend
cd server && npm run dev

# Admin Frontend
cd admin && npm start
```

### 2. Xem thống kê tồn kho
- Mở http://localhost:3001
- Đăng nhập admin
- Vào Dashboard → Xem "Thống Kê Tồn Kho"

### 3. Test tính năng
```bash
# Tạo đơn hàng từ user frontend
# Xem cập nhật trong admin dashboard
# Hoặc chạy test script
cd server && npm run test-inventory
```

## 🔧 Cấu hình

### Environment Variables:
```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/sales_management
```

### Thresholds (có thể điều chỉnh):
```javascript
// Trong productUpdateService.js
const LOW_STOCK_THRESHOLD = 5; // Sắp hết hàng
const OUT_OF_STOCK = 0; // Hết hàng
```

## 📈 Monitoring

### Logs:
```javascript
// Console logs khi cập nhật
console.log(`Đã cập nhật sản phẩm ${product.name}:`, updateData);
console.log(`Cập nhật trạng thái sản phẩm ${product.name}: ${isActive ? 'Có hàng' : 'Hết hàng'}`);
```

### Error Handling:
- Không throw error khi cập nhật tồn kho
- Log lỗi để debug
- Không ảnh hưởng đến việc tạo/cập nhật đơn hàng

## 🔄 Workflow

### User mua hàng:
1. User thêm sản phẩm vào giỏ hàng
2. User checkout và tạo đơn hàng
3. **Hệ thống tự động giảm tồn kho**
4. Admin xác nhận đơn hàng
5. Admin giao hàng
6. **Hệ thống tự động tăng số lượng đã bán**

### Admin quản lý:
1. Xem thống kê tồn kho trong Dashboard
2. Kiểm tra sản phẩm sắp hết hàng
3. Cập nhật tồn kho nếu cần
4. Nhập hàng mới khi cần thiết

## 🎯 Benefits

### Cho Admin:
- ✅ **Real-time tracking** tồn kho
- ✅ **Cảnh báo sớm** sản phẩm sắp hết hàng
- ✅ **Thống kê chi tiết** tỷ lệ tồn kho
- ✅ **Tự động cập nhật** không cần thao tác thủ công

### Cho User:
- ✅ **Hiển thị chính xác** tồn kho
- ✅ **Tránh đặt hàng** sản phẩm hết hàng
- ✅ **Trải nghiệm mượt mà** khi mua hàng

### Cho Hệ thống:
- ✅ **Tính nhất quán** dữ liệu
- ✅ **Giảm lỗi** thao tác thủ công
- ✅ **Tối ưu hiệu suất** với real-time updates

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready 