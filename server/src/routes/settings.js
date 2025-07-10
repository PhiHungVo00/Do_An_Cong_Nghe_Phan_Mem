const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// Get user settings
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Get store settings from user preferences or default values
    const settings = {
      store: {
        name: user.storeName || 'Cửa hàng ABC',
        address: user.storeAddress || '123 Đường XYZ, Quận 1, TP.HCM',
        phone: user.storePhone || '0123456789',
        email: user.storeEmail || user.email,
        logo: user.storeLogo || ''
      },
      notifications: {
        email: user.notifyEmail !== undefined ? user.notifyEmail : true,
        browser: user.notifyBrowser !== undefined ? user.notifyBrowser : false
      },
      security: {
        enable2FA: user.enable2FA || false
      },
      theme: {
        darkMode: user.darkMode || false,
        primaryColor: user.primaryColor || '#1976d2'
      },
      preferences: {
        language: user.language || 'vi',
        timezone: user.timezone || 'Asia/Ho_Chi_Minh'
      },
      payment: {
        bankName: user.bankName || '',
        bankAccount: user.bankAccount || '',
        accountHolder: user.accountHolder || ''
      }
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy cài đặt' });
  }
});

// Update store information
router.put('/store', auth, adminAuth, async (req, res) => {
  try {
    const { name, address, phone, email, logo } = req.body;

    const updateData = {};
    if (name) updateData.storeName = name;
    if (address) updateData.storeAddress = address;
    if (phone) updateData.storePhone = phone;
    if (email) updateData.storeEmail = email;
    if (logo) updateData.storeLogo = logo;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Cập nhật thông tin cửa hàng thành công',
      store: {
        name: user.storeName,
        address: user.storeAddress,
        phone: user.storePhone,
        email: user.storeEmail,
        logo: user.storeLogo
      }
    });
  } catch (error) {
    console.error('Error updating store info:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin cửa hàng' });
  }
});

// Change password
router.put('/password', auth, adminAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu' });
  }
});

// Update notification settings
router.put('/notifications', auth, adminAuth, async (req, res) => {
  try {
    const { email, browser } = req.body;

    const updateData = {};
    if (email !== undefined) updateData.notifyEmail = email;
    if (browser !== undefined) updateData.notifyBrowser = browser;

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({ 
      message: 'Cập nhật cài đặt thông báo thành công',
      notifications: { email, browser }
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật cài đặt thông báo' });
  }
});

// Update security settings
router.put('/security', auth, adminAuth, async (req, res) => {
  try {
    const { enable2FA } = req.body;

    await User.findByIdAndUpdate(req.user.id, { enable2FA });

    res.json({ 
      message: 'Cập nhật cài đặt bảo mật thành công',
      security: { enable2FA }
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật cài đặt bảo mật' });
  }
});

// Update theme settings
router.put('/theme', auth, adminAuth, async (req, res) => {
  try {
    const { darkMode, primaryColor } = req.body;

    const updateData = {};
    if (darkMode !== undefined) updateData.darkMode = darkMode;
    if (primaryColor) updateData.primaryColor = primaryColor;

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({ 
      message: 'Cập nhật cài đặt giao diện thành công',
      theme: { darkMode, primaryColor }
    });
  } catch (error) {
    console.error('Error updating theme settings:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật cài đặt giao diện' });
  }
});

// Update preferences
router.put('/preferences', auth, adminAuth, async (req, res) => {
  try {
    const { language, timezone } = req.body;

    const updateData = {};
    if (language) updateData.language = language;
    if (timezone) updateData.timezone = timezone;

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({ 
      message: 'Cập nhật cài đặt ngôn ngữ và múi giờ thành công',
      preferences: { language, timezone }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật cài đặt ngôn ngữ và múi giờ' });
  }
});

// Update payment settings
router.put('/payment', auth, adminAuth, async (req, res) => {
  try {
    const { bankName, bankAccount, accountHolder } = req.body;

    const updateData = {};
    if (bankName) updateData.bankName = bankName;
    if (bankAccount) updateData.bankAccount = bankAccount;
    if (accountHolder) updateData.accountHolder = accountHolder;

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({ 
      message: 'Lưu thông tin thanh toán thành công',
      payment: { bankName, bankAccount, accountHolder }
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    res.status(500).json({ message: 'Lỗi server khi lưu thông tin thanh toán' });
  }
});

// Delete account
router.delete('/account', auth, adminAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu để xác nhận' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    // Delete user account
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Tài khoản đã được xóa thành công' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa tài khoản' });
  }
});

module.exports = router; 