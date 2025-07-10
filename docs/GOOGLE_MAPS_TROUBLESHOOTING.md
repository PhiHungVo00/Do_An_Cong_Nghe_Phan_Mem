# 🔧 Khắc phục lỗi Google Maps API

## 🚨 Lỗi thường gặp

### 1. "Google API is already presented"

**Nguyên nhân:** Google Maps API được load nhiều lần

**Giải pháp:**
- ✅ Đã sửa bằng cách sử dụng `GoogleMapsProvider` global
- ✅ Sử dụng `useGoogleMaps()` hook thay vì `LoadScript` component
- ✅ Tránh load script nhiều lần

### 2. "Google Maps API key is invalid"

**Nguyên nhân:** API key không đúng hoặc chưa cấu hình

**Giải pháp:**
```bash
# 1. Tạo file .env trong thư mục user/
echo "REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key" > user/.env

# 2. Restart development server
cd user && npm start
```

### 3. "Google Maps not loading"

**Nguyên nhân:** Network issues hoặc API restrictions

**Giải pháp:**
- Kiểm tra internet connection
- Kiểm tra API key restrictions trong Google Cloud Console
- Kiểm tra domain whitelist

## 🔧 Cấu hình đúng

### 1. Google Cloud Console Setup
```
1. Truy cập https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project hiện có
3. Enable APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (tùy chọn)
4. Tạo API Key
5. Cấu hình restrictions:
   - Application restrictions: HTTP referrers
   - API restrictions: Chỉ chọn Maps và Geocoding
```

### 2. Domain Restrictions
```
http://localhost:3000/*
http://localhost:3001/*
https://yourdomain.com/* (production)
```

### 3. Environment Variables
```bash
# user/.env
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Test nhanh

### 1. Kiểm tra API Key
```bash
# Test API key trong browser console
curl "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"
```

### 2. Kiểm tra component
```javascript
// Trong browser console
console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
```

### 3. Test Google Maps
```bash
# Mở http://localhost:3000
# Click "Giao đến"
# Click "Chọn địa chỉ trên bản đồ Google Maps"
```

## 🐛 Debug Steps

### Step 1: Kiểm tra Environment Variables
```bash
cd user
cat .env
```

### Step 2: Kiểm tra Console Errors
```bash
# Mở browser DevTools (F12)
# Kiểm tra Console tab
# Tìm lỗi liên quan đến Google Maps
```

### Step 3: Kiểm tra Network Requests
```bash
# Trong DevTools > Network tab
# Tìm requests đến maps.googleapis.com
# Kiểm tra response status
```

### Step 4: Test API Key trực tiếp
```javascript
// Trong browser console
fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`)
  .then(response => console.log('API Key status:', response.status))
  .catch(error => console.error('API Key error:', error));
```

## ✅ Checklist khắc phục

- [ ] API key được cấu hình đúng trong .env
- [ ] Google Cloud Console APIs đã enable
- [ ] Domain restrictions đã cấu hình
- [ ] Development server đã restart
- [ ] Browser cache đã clear
- [ ] Console không có lỗi Google Maps
- [ ] Network requests thành công

## 🚀 Restart nhanh

```bash
# 1. Stop development servers
# Ctrl+C trong cả 2 terminal

# 2. Clear cache
cd user && npm run build -- --reset-cache

# 3. Restart servers
cd ../server && npm run dev
cd ../user && npm start
```

## 📞 Support

Nếu vẫn gặp lỗi:
1. Kiểm tra Google Cloud Console billing
2. Kiểm tra API quotas
3. Thử API key khác
4. Kiểm tra firewall/network restrictions 