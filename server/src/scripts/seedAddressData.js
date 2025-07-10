const mongoose = require('mongoose');
const Address = require('../models/Address');
require('dotenv').config();

// Dữ liệu mẫu cho một số tỉnh/thành phố chính
const addressData = [
  // Tỉnh/Thành phố (level 1)
  {
    code: '01',
    name: 'Hà Nội',
    full_name: 'Thành phố Hà Nội',
    administrative_unit_id: 1,
    administrative_region_id: 3,
    level: 1,
    parent_code: null
  },
  {
    code: '79',
    name: 'TP. Hồ Chí Minh',
    full_name: 'Thành phố Hồ Chí Minh',
    administrative_unit_id: 1,
    administrative_region_id: 7,
    level: 1,
    parent_code: null
  },
  {
    code: '92',
    name: 'Cần Thơ',
    full_name: 'Thành phố Cần Thơ',
    administrative_unit_id: 1,
    administrative_region_id: 8,
    level: 1,
    parent_code: null
  },
  {
    code: '48',
    name: 'Đà Nẵng',
    full_name: 'Thành phố Đà Nẵng',
    administrative_unit_id: 1,
    administrative_region_id: 5,
    level: 1,
    parent_code: null
  },
  {
    code: '95',
    name: 'Bạc Liêu',
    full_name: 'Tỉnh Bạc Liêu',
    administrative_unit_id: 2,
    administrative_region_id: 8,
    level: 1,
    parent_code: null
  },

  // Quận/Huyện của Hà Nội (level 2)
  {
    code: '001',
    name: 'Ba Đình',
    full_name: 'Quận Ba Đình',
    administrative_unit_id: 2,
    administrative_region_id: 3,
    level: 2,
    parent_code: '01'
  },
  {
    code: '002',
    name: 'Hoàn Kiếm',
    full_name: 'Quận Hoàn Kiếm',
    administrative_unit_id: 2,
    administrative_region_id: 3,
    level: 2,
    parent_code: '01'
  },
  {
    code: '003',
    name: 'Hai Bà Trưng',
    full_name: 'Quận Hai Bà Trưng',
    administrative_unit_id: 2,
    administrative_region_id: 3,
    level: 2,
    parent_code: '01'
  },
  {
    code: '004',
    name: 'Đống Đa',
    full_name: 'Quận Đống Đa',
    administrative_unit_id: 2,
    administrative_region_id: 3,
    level: 2,
    parent_code: '01'
  },
  {
    code: '005',
    name: 'Tây Hồ',
    full_name: 'Quận Tây Hồ',
    administrative_unit_id: 2,
    administrative_region_id: 3,
    level: 2,
    parent_code: '01'
  },

  // Quận/Huyện của TP. Hồ Chí Minh (level 2)
  {
    code: '760',
    name: 'Quận 1',
    full_name: 'Quận 1',
    administrative_unit_id: 2,
    administrative_region_id: 7,
    level: 2,
    parent_code: '79'
  },
  {
    code: '761',
    name: 'Quận 2',
    full_name: 'Quận 2',
    administrative_unit_id: 2,
    administrative_region_id: 7,
    level: 2,
    parent_code: '79'
  },
  {
    code: '762',
    name: 'Quận 3',
    full_name: 'Quận 3',
    administrative_unit_id: 2,
    administrative_region_id: 7,
    level: 2,
    parent_code: '79'
  },
  {
    code: '763',
    name: 'Quận 4',
    full_name: 'Quận 4',
    administrative_unit_id: 2,
    administrative_region_id: 7,
    level: 2,
    parent_code: '79'
  },
  {
    code: '764',
    name: 'Quận 5',
    full_name: 'Quận 5',
    administrative_unit_id: 2,
    administrative_region_id: 7,
    level: 2,
    parent_code: '79'
  },

  // Xã/Phường của Quận Ba Đình (level 3)
  {
    code: '00001',
    name: 'Phúc Xá',
    full_name: 'Phường Phúc Xá',
    administrative_unit_id: 3,
    administrative_region_id: 3,
    level: 3,
    parent_code: '001'
  },
  {
    code: '00004',
    name: 'Trúc Bạch',
    full_name: 'Phường Trúc Bạch',
    administrative_unit_id: 3,
    administrative_region_id: 3,
    level: 3,
    parent_code: '001'
  },
  {
    code: '00006',
    name: 'Vĩnh Phúc',
    full_name: 'Phường Vĩnh Phúc',
    administrative_unit_id: 3,
    administrative_region_id: 3,
    level: 3,
    parent_code: '001'
  },
  {
    code: '00007',
    name: 'Cống Vị',
    full_name: 'Phường Cống Vị',
    administrative_unit_id: 3,
    administrative_region_id: 3,
    level: 3,
    parent_code: '001'
  },
  {
    code: '00008',
    name: 'Liễu Giai',
    full_name: 'Phường Liễu Giai',
    administrative_unit_id: 3,
    administrative_region_id: 3,
    level: 3,
    parent_code: '001'
  },

  // Xã/Phường của Quận 1 TP.HCM (level 3)
  {
    code: '26734',
    name: 'Bến Nghé',
    full_name: 'Phường Bến Nghé',
    administrative_unit_id: 3,
    administrative_region_id: 7,
    level: 3,
    parent_code: '760'
  },
  {
    code: '26737',
    name: 'Bến Thành',
    full_name: 'Phường Bến Thành',
    administrative_unit_id: 3,
    administrative_region_id: 7,
    level: 3,
    parent_code: '760'
  },
  {
    code: '26740',
    name: 'Đa Kao',
    full_name: 'Phường Đa Kao',
    administrative_unit_id: 3,
    administrative_region_id: 7,
    level: 3,
    parent_code: '760'
  },
  {
    code: '26743',
    name: 'Nguyễn Thái Bình',
    full_name: 'Phường Nguyễn Thái Bình',
    administrative_unit_id: 3,
    administrative_region_id: 7,
    level: 3,
    parent_code: '760'
  },
  {
    code: '26746',
    name: 'Phạm Ngũ Lão',
    full_name: 'Phường Phạm Ngũ Lão',
    administrative_unit_id: 3,
    administrative_region_id: 7,
    level: 3,
    parent_code: '760'
  }
];

const seedAddressData = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await Address.deleteMany({});
    console.log('Cleared existing address data');

    // Thêm dữ liệu mới
    const result = await Address.insertMany(addressData);
    console.log(`Successfully seeded ${result.length} address records`);

    // Hiển thị thống kê
    const provinces = await Address.countDocuments({ level: 1 });
    const districts = await Address.countDocuments({ level: 2 });
    const wards = await Address.countDocuments({ level: 3 });

    console.log('\nAddress Data Statistics:');
    console.log(`- Provinces/Cities: ${provinces}`);
    console.log(`- Districts: ${districts}`);
    console.log(`- Wards: ${wards}`);
    console.log(`- Total: ${provinces + districts + wards}`);

    console.log('\nSample data seeded successfully!');
    console.log('You can now use the address selection feature.');

  } catch (error) {
    console.error('Error seeding address data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  seedAddressData();
}

module.exports = seedAddressData; 