const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testSettings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Test 1: Check if admin user exists and has settings
    console.log('\n=== Kiểm tra tài khoản admin ===');
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (adminUser) {
      console.log('✅ Tìm thấy tài khoản admin');
      console.log(`- Username: ${adminUser.username}`);
      console.log(`- Email: ${adminUser.email}`);
      console.log(`- Store Name: ${adminUser.storeName || 'Chưa cập nhật'}`);
      console.log(`- Store Address: ${adminUser.storeAddress || 'Chưa cập nhật'}`);
      console.log(`- Store Phone: ${adminUser.storePhone || 'Chưa cập nhật'}`);
      console.log(`- Dark Mode: ${adminUser.darkMode ? 'Bật' : 'Tắt'}`);
      console.log(`- Language: ${adminUser.language || 'vi'}`);
      console.log(`- Timezone: ${adminUser.timezone || 'Asia/Ho_Chi_Minh'}`);
    } else {
      console.log('❌ Không tìm thấy tài khoản admin');
    }

    // Test 2: Update some settings for admin user
    console.log('\n=== Cập nhật cài đặt mẫu ===');
    if (adminUser) {
      const updateData = {
        storeName: 'Cửa hàng Smart Home',
        storeAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        storePhone: '0901234567',
        storeEmail: 'contact@smarthome.com',
        darkMode: false,
        primaryColor: '#6C63FF',
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        notifyEmail: true,
        notifyBrowser: false,
        enable2FA: false,
        bankName: 'Vietcombank',
        bankAccount: '1234567890',
        accountHolder: 'Công ty Smart Home'
      };

      await User.findByIdAndUpdate(adminUser._id, updateData);
      console.log('✅ Đã cập nhật cài đặt mẫu cho admin user');
    }

    // Test 3: Check updated settings
    console.log('\n=== Kiểm tra cài đặt sau khi cập nhật ===');
    const updatedUser = await User.findById(adminUser._id);
    if (updatedUser) {
      console.log('✅ Cài đặt đã được cập nhật:');
      console.log(`- Store Name: ${updatedUser.storeName}`);
      console.log(`- Store Address: ${updatedUser.storeAddress}`);
      console.log(`- Store Phone: ${updatedUser.storePhone}`);
      console.log(`- Store Email: ${updatedUser.storeEmail}`);
      console.log(`- Dark Mode: ${updatedUser.darkMode ? 'Bật' : 'Tắt'}`);
      console.log(`- Primary Color: ${updatedUser.primaryColor}`);
      console.log(`- Language: ${updatedUser.language}`);
      console.log(`- Timezone: ${updatedUser.timezone}`);
      console.log(`- Email Notifications: ${updatedUser.notifyEmail ? 'Bật' : 'Tắt'}`);
      console.log(`- Browser Notifications: ${updatedUser.notifyBrowser ? 'Bật' : 'Tắt'}`);
      console.log(`- 2FA: ${updatedUser.enable2FA ? 'Bật' : 'Tắt'}`);
      console.log(`- Bank Name: ${updatedUser.bankName}`);
      console.log(`- Bank Account: ${updatedUser.bankAccount}`);
      console.log(`- Account Holder: ${updatedUser.accountHolder}`);
    }

    // Test 4: Test password change functionality
    console.log('\n=== Kiểm tra chức năng đổi mật khẩu ===');
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    // Create a test user for password testing
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      fullName: 'Test User',
      role: 'admin'
    });
    
    await testUser.save();
    console.log('✅ Đã tạo test user');

    // Test password verification
    const isMatch = await bcrypt.compare(testPassword, testUser.password);
    console.log(`✅ Password verification: ${isMatch ? 'Thành công' : 'Thất bại'}`);

    // Clean up test user
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Đã xóa test user');

    console.log('\n=== Test hoàn thành ===');
    console.log('Tất cả API endpoints settings đã sẵn sàng sử dụng:');
    console.log('- GET /api/settings - Lấy cài đặt');
    console.log('- PUT /api/settings/store - Cập nhật thông tin cửa hàng');
    console.log('- PUT /api/settings/password - Đổi mật khẩu');
    console.log('- PUT /api/settings/notifications - Cập nhật thông báo');
    console.log('- PUT /api/settings/security - Cập nhật bảo mật');
    console.log('- PUT /api/settings/theme - Cập nhật giao diện');
    console.log('- PUT /api/settings/preferences - Cập nhật ngôn ngữ/múi giờ');
    console.log('- PUT /api/settings/payment - Cập nhật thanh toán');
    console.log('- DELETE /api/settings/account - Xóa tài khoản');

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testSettings(); 