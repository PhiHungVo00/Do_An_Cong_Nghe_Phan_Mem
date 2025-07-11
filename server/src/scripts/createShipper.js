const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createShipper = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management');
    
    // Danh sách shipper cần tạo
    const shippers = [
      {
        username: 'shipper1',
        email: 'shipper1@delivery.com',
        password: 'shipper123',
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        role: 'shipper',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      {
        username: 'shipper2',
        email: 'shipper2@delivery.com',
        password: 'shipper123',
        fullName: 'Trần Thị B',
        phone: '0987654321',
        role: 'shipper',
        address: '456 Đường XYZ, Quận 2, TP.HCM'
      },
      {
        username: 'shipper3',
        email: 'shipper3@delivery.com',
        password: 'shipper123',
        fullName: 'Lê Văn C',
        phone: '0555666777',
        role: 'shipper',
        address: '789 Đường DEF, Quận 3, TP.HCM'
      }
    ];

    console.log('Creating shipper accounts...');

    for (const shipperData of shippers) {
      // Kiểm tra xem shipper đã tồn tại chưa
      const existingShipper = await User.findOne({ 
        $or: [
          { username: shipperData.username },
          { email: shipperData.email }
        ]
      });

      if (existingShipper) {
        console.log(`Shipper ${shipperData.username} already exists, skipping...`);
        continue;
      }

      // Tạo tài khoản shipper
      const shipper = new User(shipperData);
      await shipper.save();
      console.log(`Shipper ${shipperData.username} created successfully`);
    }

    console.log('All shipper accounts created successfully!');
    console.log('\nShipper login credentials:');
    console.log('Email: shipper1@delivery.com | Password: shipper123');
    console.log('Email: shipper2@delivery.com | Password: shipper123');
    console.log('Email: shipper3@delivery.com | Password: shipper123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating shipper accounts:', error);
    process.exit(1);
  }
};

createShipper(); 