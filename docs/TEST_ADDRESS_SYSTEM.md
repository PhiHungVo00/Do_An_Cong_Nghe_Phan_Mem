# 🧪 Test Hệ Thống Địa Chỉ

## 🚀 Khởi động nhanh

### 1. Seed dữ liệu địa chỉ
```bash
cd server
npm run seed-full-address-data
```

### 2. Khởi động backend
```bash
cd server
npm run dev
```

### 3. Khởi động frontend
```bash
cd user
npm start
```

## 🎯 Test Cases

### Test 1: Dropdown Địa Chỉ Hành Chính
1. Mở http://localhost:3000
2. Click "Giao đến"
3. Chọn tỉnh/thành phố → Quận/huyện → Phường/xã
4. Nhập số nhà và tên đường
5. Click "Lưu địa chỉ"

**Kết quả mong đợi:**
- Dropdown load dữ liệu từ database
- Cascading filter hoạt động đúng
- Địa chỉ được lưu thành công

### Test 2: Google Maps Integration
1. Click "Chọn địa chỉ trên bản đồ Google Maps"
2. Test tìm kiếm địa chỉ
3. Test vị trí hiện tại
4. Click vào bản đồ để chọn vị trí
5. Click "Chọn địa chỉ này"

**Kết quả mong đợi:**
- Bản đồ load thành công
- Tìm kiếm hoạt động
- GPS location hoạt động
- Địa chỉ được parse đúng

### Test 3: API Endpoints
```bash
# Test provinces
curl http://localhost:5000/api/address/provinces

# Test districts
curl http://localhost:5000/api/address/districts?provinceId=01

# Test wards
curl http://localhost:5000/api/address/wards?districtId=001
```

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **Google Maps không load**
   - Kiểm tra API key trong .env
   - Kiểm tra console errors
   - Kiểm tra network connection

2. **Dropdown không có dữ liệu**
   - Chạy lại seed script
   - Kiểm tra database connection
   - Kiểm tra API endpoints

3. **TypeScript errors**
   - Chạy `npm install` trong thư mục user
   - Kiểm tra import statements
   - Restart development server

## 📊 Kiểm tra dữ liệu

### MongoDB
```javascript
// Kiểm tra collections
use sales_management
show collections

// Kiểm tra dữ liệu provinces
db.addresses.find({type: "province"}).limit(5)

// Kiểm tra dữ liệu districts
db.addresses.find({type: "district"}).limit(5)
```

### API Response
```bash
# Test provinces endpoint
curl -X GET http://localhost:5000/api/address/provinces | jq

# Test districts endpoint  
curl -X GET "http://localhost:5000/api/address/districts?provinceId=01" | jq
```

## ✅ Checklist hoàn thành

- [ ] Seed dữ liệu địa chỉ đầy đủ
- [ ] Google Maps API key được cấu hình
- [ ] Backend API endpoints hoạt động
- [ ] Frontend components load đúng
- [ ] Dropdown cascading hoạt động
- [ ] Google Maps integration hoạt động
- [ ] Địa chỉ được lưu thành công
- [ ] Error handling hoạt động

## 🎉 Kết quả cuối cùng

Hệ thống địa chỉ đã được hoàn thiện với:
- ✅ Dữ liệu địa chỉ Việt Nam đầy đủ (63 tỉnh/thành)
- ✅ Cascading dropdown filters
- ✅ Google Maps integration
- ✅ Geocoding và reverse geocoding
- ✅ GPS location support
- ✅ Address parsing và validation
- ✅ Responsive design
- ✅ Error handling
- ✅ TypeScript support 