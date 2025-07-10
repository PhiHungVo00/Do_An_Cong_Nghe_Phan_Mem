const mongoose = require('mongoose');
const Product = require('../src/models/Product');
require('dotenv').config();

async function testTopSellingProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if products have image data
    const products = await Product.find({ isActive: true }).limit(5);
    
    console.log('\n=== Kiểm tra dữ liệu sản phẩm ===');
    products.forEach((product, index) => {
      console.log(`\nSản phẩm ${index + 1}:`);
      console.log(`- Tên: ${product.name}`);
      console.log(`- Hình ảnh: ${product.image}`);
      console.log(`- Đã bán: ${product.soldCount}`);
      console.log(`- Giá: ${product.price.toLocaleString('vi-VN')} VNĐ`);
      console.log(`- Trạng thái: ${product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}`);
    });

    // Test the aggregation query
    console.log('\n=== Kiểm tra API Top Selling Products ===');
    
    const topProducts = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $addFields: {
          soldCount: { $sum: '$soldCount' },
          revenue: { $multiply: ['$price', '$soldCount'] }
        }
      },
      {
        $sort: { soldCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          soldCount: 1,
          revenue: 1,
          image: 1,
          status: { $cond: [{ $gt: ['$stock', 0] }, 'In Stock', 'Out of Stock'] }
        }
      }
    ]);

    console.log('\nTop 5 sản phẩm bán chạy:');
    topProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   - Hình ảnh: ${product.image}`);
      console.log(`   - Đã bán: ${product.soldCount}`);
      console.log(`   - Doanh thu: ${product.revenue.toLocaleString('vi-VN')} VNĐ`);
      console.log(`   - Trạng thái: ${product.status === 'In Stock' ? 'Còn hàng' : 'Hết hàng'}`);
    });

    // Check if image files exist
    console.log('\n=== Kiểm tra file hình ảnh ===');
    const fs = require('fs');
    const path = require('path');
    const assetsPath = path.join(__dirname, '../src/assets/products');
    
    topProducts.forEach((product) => {
      if (product.image) {
        const imagePath = path.join(assetsPath, product.image);
        const exists = fs.existsSync(imagePath);
        console.log(`- ${product.image}: ${exists ? '✅ Tồn tại' : '❌ Không tồn tại'}`);
      } else {
        console.log(`- Sản phẩm ${product.name}: Không có hình ảnh`);
      }
    });

    console.log('\n=== Test hoàn thành ===');
    console.log('Nếu có sản phẩm không có hình ảnh, hãy cập nhật trường image trong database');
    console.log('URL hình ảnh sẽ là: http://localhost:5000/assets/products/[tên_file]');

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testTopSellingProducts(); 