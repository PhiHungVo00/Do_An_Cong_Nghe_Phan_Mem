# 🗺️ Cấu hình Google Maps API

## 📋 Yêu cầu

### 1. Google Cloud Platform Account
- Truy cập [Google Cloud Console](https://console.cloud.google.com/)
- Tạo project mới hoặc sử dụng project hiện có

### 2. Enable APIs
Trong Google Cloud Console, enable các API sau:
- **Maps JavaScript API**
- **Geocoding API**
- **Places API** (tùy chọn)

### 3. Tạo API Key
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API key và cấu hình restrictions

## 🔧 Cấu hình trong dự án

### 1. Tạo file .env trong thư mục user/
```bash
# user/.env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Cấu hình API Key Restrictions
Trong Google Cloud Console:
- **Application restrictions**: HTTP referrers
- **API restrictions**: Chỉ chọn Maps JavaScript API và Geocoding API

### 3. Domain Restrictions (Production)
```
http://localhost:3000/*
http://localhost:3001/*
https://yourdomain.com/*
```

## 🚀 Chạy hệ thống với dữ liệu đầy đủ

### 1. Seed dữ liệu địa chỉ đầy đủ
```bash
cd server
npm run seed-full-address-data
```

### 2. Khởi động hệ thống
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd user
npm start
```

## 🎯 Tính năng Google Maps

### 1. Tìm kiếm địa chỉ
- Nhập địa chỉ vào ô tìm kiếm
- Tự động geocoding và hiển thị trên bản đồ
- Hỗ trợ tìm kiếm tiếng Việt

### 2. Vị trí hiện tại
- Sử dụng GPS của thiết bị
- Tự động định vị và hiển thị trên bản đồ
- Reverse geocoding để lấy địa chỉ

### 3. Chọn địa chỉ chính xác
- Click vào bản đồ để chọn vị trí
- Hiển thị thông tin chi tiết
- Tọa độ chính xác

### 4. Tích hợp với hệ thống địa chỉ
- Kết hợp với dropdown địa chỉ hành chính
- Tự động parse địa chỉ thành các thành phần
- Lưu trữ cả địa chỉ text và tọa độ

## 🔒 Bảo mật

### 1. API Key Security
- Không commit API key vào git
- Sử dụng environment variables
- Cấu hình restrictions trong Google Cloud Console

### 2. Rate Limiting
- Google Maps API có giới hạn request
- Implement caching cho kết quả tìm kiếm
- Monitor usage trong Google Cloud Console

## 📊 Monitoring

### 1. Google Cloud Console
- **APIs & Services** > **Dashboard**
- Theo dõi API usage và errors
- Cấu hình alerts cho quota limits

### 2. Application Logs
```bash
# Backend logs
cd server && npm run dev

# Frontend logs
cd user && npm start
```

## 🐛 Troubleshooting

### 1. API Key không hoạt động
```bash
# Kiểm tra .env file
cat user/.env

# Kiểm tra console errors
F12 > Console
```

### 2. Maps không load
- Kiểm tra internet connection
- Kiểm tra API key restrictions
- Kiểm tra domain whitelist

### 3. Geocoding errors
- Kiểm tra Geocoding API đã enable
- Kiểm tra quota limits
- Kiểm tra address format

## 💰 Chi phí

### 1. Google Maps API Pricing (2024)
- **Maps JavaScript API**: $7 per 1000 loads
- **Geocoding API**: $5 per 1000 requests
- **Places API**: $17 per 1000 requests

### 2. Free Tier
- $200 credit mỗi tháng
- Khoảng 28,500 requests miễn phí

### 3. Optimization
- Implement caching
- Sử dụng local storage cho kết quả tìm kiếm
- Lazy loading cho maps

## 📈 Performance Tips

### 1. Lazy Loading
```javascript
// Chỉ load Google Maps khi cần
const GoogleMapSelector = React.lazy(() => import('./GoogleMapSelector'));
```

### 2. Caching
```javascript
// Cache geocoding results
const cache = new Map();
const cachedGeocode = (address) => {
  if (cache.has(address)) {
    return cache.get(address);
  }
  // ... geocoding logic
};
```

### 3. Debouncing
```javascript
// Debounce search input
const debouncedSearch = useCallback(
  debounce((query) => {
    handleSearch(query);
  }, 300),
  []
);
```

## 🔄 Development Workflow

### 1. Local Development
```bash
# Setup environment
cp user/.env.example user/.env
# Edit user/.env with your API key

# Start development
npm run dev  # Backend
npm start    # Frontend
```

### 2. Testing
```bash
# Test address selection
# 1. Open http://localhost:3000
# 2. Click "Giao đến"
# 3. Try "Chọn địa chỉ trên bản đồ Google Maps"
# 4. Test search and location selection
```

### 3. Production Deployment
```bash
# Build frontend
cd user && npm run build

# Set production environment variables
REACT_APP_GOOGLE_MAPS_API_KEY=your_production_api_key
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 📝 Notes

- API key phải được cấu hình đúng domain
- Test trên localhost trước khi deploy
- Monitor usage để tránh chi phí cao
- Implement error handling cho network issues 