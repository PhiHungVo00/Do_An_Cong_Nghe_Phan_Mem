const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('-password');
    console.log('\n=== DANH SÁCH USERS TRONG DATABASE ===');
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Full Name: ${user.fullName}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Is Active: ${user.isActive}`);
      console.log(`  Created: ${user.createdAt}`);
    });

    // Test login with admin account
    console.log('\n=== TEST LOGIN ===');
    const adminUser = await User.findOne({ username: 'admin' });
    if (adminUser) {
      console.log('Admin user found!');
      console.log(`Username: ${adminUser.username}`);
      console.log(`Email: ${adminUser.email}`);
      console.log(`Role: ${adminUser.role}`);
      
      // Test password
      const isMatch = await adminUser.comparePassword('admin123');
      console.log(`Password match: ${isMatch}`);
    } else {
      console.log('Admin user not found!');
    }

    // Test login with user account
    const normalUser = await User.findOne({ username: 'user1' });
    if (normalUser) {
      console.log('\nNormal user found!');
      console.log(`Username: ${normalUser.username}`);
      console.log(`Email: ${normalUser.email}`);
      console.log(`Role: ${normalUser.role}`);
      
      // Test password
      const isMatch = await normalUser.comparePassword('user123');
      console.log(`Password match: ${isMatch}`);
    } else {
      console.log('Normal user not found!');
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the check function
checkUsers(); 