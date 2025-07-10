const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpEmail } = require('../services/sendMailService');
const crypto = require('crypto');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, isActive: true });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      fullName,
      role: role || 'employee'
    });

    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user;
    if (username) {
      user = await User.findOne({ username, isActive: true });
    } else if (email) {
      user = await User.findOne({ email, isActive: true });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['fullName', 'email', 'phone', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy thông tin user hiện tại
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Lấy user admin đầu tiên
router.get('/admin', async (req, res) => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) return res.status(404).json({ message: 'Không tìm thấy admin' });
  res.json({ _id: admin._id, fullName: admin.fullName, email: admin.email });
});

// Lưu OTP tạm thời ở RAM
const otpStore = new Map();

// Gửi OTP xác thực email
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email là bắt buộc' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Lưu OTP vào Map với thời gian hết hạn
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
    await sendOtpEmail(email, otp);
    res.json({ message: 'Đã gửi mã OTP về email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xác thực OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Thiếu email hoặc OTP' });
    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ message: 'Không tìm thấy OTP' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Mã OTP không đúng' });
    if (record.expires < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'Mã OTP đã hết hạn' });
    }
    // Xác thực thành công, xóa OTP khỏi Map
    otpStore.delete(email);
    res.json({ message: 'Xác thực OTP thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 