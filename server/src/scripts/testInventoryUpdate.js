const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { updateProductInventory, getInventoryStats } = require('../services/productUpdateService');
require('dotenv').config();

const testInventoryUpdate = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Lấy thống kê ban đầu
    console.log('\n=== THỐNG KÊ BAN ĐẦU ===');
    const initialStats = await getInventoryStats();
    console.log('Tổng sản phẩm:', initialStats.totalProducts);
    console.log('Có hàng:', initialStats.inStock);
    console.log('Sắp hết hàng:', initialStats.lowStock);
    console.log('Hết hàng:', initialStats.outOfStock);

    // Lấy một số sản phẩm để test
    const products = await Product.find().limit(3);
    console.log('\n=== SẢN PHẨM ĐỂ TEST ===');
    products.forEach(product => {
      console.log(`${product.name}: Tồn kho ${product.stock}, Đã bán ${product.soldCount || 0}`);
    });

    if (products.length === 0) {
      console.log('Không có sản phẩm nào để test');
      return;
    }

    // Test 1: Tạo đơn hàng mới (giảm tồn kho)
    console.log('\n=== TEST 1: TẠO ĐƠN HÀNG MỚI ===');
    const testOrder1 = {
      items: [
        {
          productId: products[0]._id,
          productName: products[0].name,
          price: products[0].price,
          quantity: 2,
          image: products[0].image,
          brand: products[0].brand,
          sku: products[0].sku
        }
      ]
    };

    console.log(`Trước khi tạo đơn hàng: ${products[0].name} có ${products[0].stock} tồn kho`);
    await updateProductInventory(testOrder1.items, 'Đang xử lý');
    
    const productAfterOrder = await Product.findById(products[0]._id);
    console.log(`Sau khi tạo đơn hàng: ${productAfterOrder.name} có ${productAfterOrder.stock} tồn kho`);

    // Test 2: Cập nhật trạng thái đơn hàng thành "Đã giao hàng" (tăng số lượng đã bán)
    console.log('\n=== TEST 2: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ===');
    console.log(`Trước khi giao hàng: ${productAfterOrder.name} đã bán ${productAfterOrder.soldCount || 0}`);
    await updateProductInventory(testOrder1.items, 'Đã giao hàng');
    
    const productAfterDelivery = await Product.findById(products[0]._id);
    console.log(`Sau khi giao hàng: ${productAfterDelivery.name} đã bán ${productAfterDelivery.soldCount || 0}`);

    // Test 3: Hủy đơn hàng (tăng lại tồn kho, giảm số lượng đã bán)
    console.log('\n=== TEST 3: HỦY ĐƠN HÀNG ===');
    console.log(`Trước khi hủy: ${productAfterDelivery.name} có ${productAfterDelivery.stock} tồn kho, đã bán ${productAfterDelivery.soldCount || 0}`);
    await updateProductInventory(testOrder1.items, 'Đã hủy');
    
    const productAfterCancel = await Product.findById(products[0]._id);
    console.log(`Sau khi hủy: ${productAfterCancel.name} có ${productAfterCancel.stock} tồn kho, đã bán ${productAfterCancel.soldCount || 0}`);

    // Test 4: Kiểm tra trạng thái sản phẩm
    console.log('\n=== TEST 4: KIỂM TRA TRẠNG THÁI SẢN PHẨM ===');
    products.forEach(async (product) => {
      const updatedProduct = await Product.findById(product._id);
      console.log(`${updatedProduct.name}:`);
      console.log(`  - Tồn kho: ${updatedProduct.stock}`);
      console.log(`  - Đã bán: ${updatedProduct.soldCount || 0}`);
      console.log(`  - Trạng thái: ${updatedProduct.isActive ? 'Hoạt động' : 'Không hoạt động'}`);
      console.log(`  - Trạng thái dựa trên tồn kho: ${updatedProduct.stock === 0 ? 'Hết hàng' : updatedProduct.stock <= 5 ? 'Sắp hết hàng' : 'Có hàng'}`);
    });

    // Lấy thống kê cuối cùng
    console.log('\n=== THỐNG KÊ CUỐI CÙNG ===');
    const finalStats = await getInventoryStats();
    console.log('Tổng sản phẩm:', finalStats.totalProducts);
    console.log('Có hàng:', finalStats.inStock);
    console.log('Sắp hết hàng:', finalStats.lowStock);
    console.log('Hết hàng:', finalStats.outOfStock);

    console.log('\n✅ Test hoàn thành thành công!');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
  testInventoryUpdate();
}

module.exports = testInventoryUpdate; 