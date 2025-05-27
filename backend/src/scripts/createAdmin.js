const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management');
    
    // Kiểm tra xem admin đã tồn tại chưa
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Tạo tài khoản admin
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin account created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

createAdmin(); 