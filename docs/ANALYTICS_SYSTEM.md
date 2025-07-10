# Hệ Thống Analytics - Dashboard Thực

## Tổng Quan

Hệ thống Analytics đã được cập nhật để sử dụng dữ liệu thực thay vì mock data. Tất cả các biểu đồ và thống kê trong admin dashboard giờ đây sẽ phản ánh chính xác dữ liệu từ database.

## Các Tính Năng Chính

### 1. Dashboard Stats (Thống Kê Tổng Quan)

**API Endpoint:** `GET /api/analytics/stats`

**Tính năng:**
- Hiển thị doanh thu hiện tại và so sánh với tháng trước
- Số lượng đơn hàng và tỷ lệ tăng trưởng
- Số lượng khách hàng mới
- Số lượng sản phẩm đang hoạt động
- Lưu lượng truy cập (mock data)

**Dữ liệu trả về:**
```json
{
  "revenue": {
    "current": 11800000,
    "change": 15.2,
    "changeAmount": 1550000
  },
  "traffic": {
    "current": 611,
    "change": 6.2,
    "changeAmount": 27
  },
  "orders": {
    "current": 45,
    "change": 12.5,
    "changeAmount": 5
  },
  "products": {
    "current": 25,
    "change": 8.3,
    "changeAmount": 2
  },
  "customers": {
    "current": 12,
    "change": 20.0,
    "changeAmount": 2
  }
}
```

### 2. Sales Analytics (Phân Tích Doanh Số)

**API Endpoint:** `GET /api/analytics/sales?period={period}`

**Tham số:**
- `period`: `week`, `month`, `year` (mặc định: `month`)

**Tính năng:**
- Biểu đồ doanh thu theo thời gian
- Tổng doanh thu và số đơn hàng
- So sánh theo tuần/tháng/năm
- Dữ liệu chỉ tính các đơn hàng đã giao hoặc hoàn thành

**Dữ liệu trả về:**
```json
{
  "labels": ["15/1", "20/1", "10/2", "15/2", "5/3"],
  "revenue": [2500000, 1800000, 3200000, 1500000, 2800000],
  "orders": [1, 1, 1, 1, 1],
  "totalRevenue": 11800000,
  "totalOrders": 5
}
```

### 3. Traffic Analytics (Phân Tích Lưu Lượng)

**API Endpoint:** `GET /api/analytics/traffic?period={period}`

**Tính năng:**
- Biểu đồ phân bố nguồn traffic
- Dữ liệu mock (có thể tích hợp với Google Analytics thực)
- Hiển thị theo tuần/tháng

**Dữ liệu trả về:**
```json
{
  "labels": ["Google", "Direct", "Social Media", "Referral"],
  "datasets": [{
    "label": "Traffic",
    "data": [35, 25, 25, 15],
    "backgroundColor": ["#6C63FF", "#FFB300", "#00BFA6", "#FF6B6B"]
  }]
}
```

### 4. Top Selling Products (Sản Phẩm Bán Chạy)

**API Endpoint:** `GET /api/analytics/top-selling?limit={limit}`

**Tính năng:**
- Danh sách sản phẩm bán chạy nhất
- Sắp xếp theo số lượng đã bán
- Hiển thị hình ảnh, tên, giá và số lượng đã bán
- Ranking với badge #1, #2, #3

**Dữ liệu trả về:**
```json
[
  {
    "_id": "product_id",
    "name": "Máy lọc nước",
    "soldCount": 40,
    "price": 8000000,
    "image": "maylocnuoc.jpg"
  }
]
```

### 5. Customer Analytics (Phân Tích Khách Hàng)

**API Endpoint:** `GET /api/analytics/customers`

**Tính năng:**
- Số lượng khách hàng mới
- Khách hàng VIP (mua > 5 lần)
- Khách hàng không hoạt động (> 30 ngày)
- Tổng số khách hàng

## Cập Nhật Frontend Components

### 1. StatsCards Component

**Tính năng mới:**
- Load dữ liệu thực từ API
- Hiển thị loading state
- Error handling
- So sánh tăng/giảm với icon tương ứng
- Format tiền tệ VND

### 2. SalesAnalytics Component

**Tính năng mới:**
- Chọn khoảng thời gian (tuần/tháng/năm)
- Biểu đồ doanh thu thực
- Tổng doanh thu và đơn hàng
- Loading và error states

### 3. TrafficChart Component

**Tính năng mới:**
- Dữ liệu traffic thực
- Chuyển đổi tuần/tháng
- Dynamic labels và colors
- Loading và error handling

### 4. TopSellingProducts Component (Mới)

**Tính năng:**
- Hiển thị top 5 sản phẩm bán chạy
- Ranking badges (#1, #2, #3)
- Hình ảnh sản phẩm
- Thông tin giá và số lượng đã bán

## Cấu Trúc Database

### Orders Collection
```javascript
{
  orderNumber: String,
  customer: String,
  totalAmount: Number,
  status: String, // 'Đã giao hàng', 'Đã hoàn thành', etc.
  date: Date,
  items: Array
}
```

### Products Collection
```javascript
{
  name: String,
  price: Number,
  soldCount: Number,
  stock: Number,
  isActive: Boolean,
  image: String
}
```

### Customers Collection
```javascript
{
  name: String,
  email: String,
  phone: String,
  totalPurchases: Number,
  lastPurchaseDate: Date,
  isActive: Boolean
}
```

## API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/analytics/stats` | GET | Thống kê tổng quan dashboard |
| `/api/analytics/sales` | GET | Dữ liệu doanh số theo thời gian |
| `/api/analytics/traffic` | GET | Dữ liệu lưu lượng truy cập |
| `/api/analytics/top-selling` | GET | Sản phẩm bán chạy |
| `/api/analytics/customers` | GET | Phân tích khách hàng |

## Testing

### Chạy Test Script
```bash
cd server
node src/scripts/testAnalytics.js
```

### Test Data
Script sẽ tạo:
- 5 đơn hàng mẫu với dữ liệu thực
- 5 sản phẩm với số lượng bán khác nhau
- 5 khách hàng với thông tin mua hàng

## Lưu Ý Quan Trọng

1. **Authentication**: Tất cả API endpoints yêu cầu admin authentication
2. **Data Filtering**: Chỉ tính các đơn hàng có status "Đã giao hàng" hoặc "Đã hoàn thành"
3. **Date Ranges**: Tính toán dựa trên thời gian thực, so sánh với tháng trước
4. **Error Handling**: Tất cả components có loading states và error handling
5. **Real-time Updates**: Dữ liệu sẽ cập nhật theo thời gian thực khi có đơn hàng mới

## Tích Hợp Với Hệ Thống Hiện Tại

- Tự động cập nhật khi có đơn hàng mới
- Tích hợp với inventory management system
- Tích hợp với customer auto-management
- Sử dụng dữ liệu từ product update service

## Monitoring và Performance

- API response time monitoring
- Database query optimization
- Caching cho các thống kê phức tạp
- Error logging và alerting

## Kế Hoạch Phát Triển

1. **Google Analytics Integration**: Thay thế mock traffic data
2. **Advanced Filtering**: Thêm filters theo category, region
3. **Export Features**: Export reports to PDF/Excel
4. **Real-time Updates**: WebSocket cho live updates
5. **Custom Dashboards**: Cho phép admin tùy chỉnh dashboard 