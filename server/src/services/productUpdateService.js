const Product = require('../models/Product');

/**
 * Cập nhật thông tin sản phẩm khi có đơn hàng mới
 * @param {Array} items - Danh sách sản phẩm trong đơn hàng
 * @param {string} orderStatus - Trạng thái đơn hàng
 */
const updateProductInventory = async (items, orderStatus) => {
  try {
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        console.warn(`Sản phẩm không tồn tại: ${item.productId}`);
        continue;
      }

      const updateData = {};

      // Cập nhật số lượng tồn kho
      if (orderStatus === 'Đang xử lý' || orderStatus === 'Đã xác nhận') {
        // Giảm tồn kho khi đơn hàng được xác nhận
        updateData.stock = Math.max(0, product.stock - item.quantity);
        
        // Cập nhật trạng thái sản phẩm dựa trên tồn kho
        if (updateData.stock === 0) {
          updateData.isActive = false; // Hết hàng
        } else if (updateData.stock <= 5) {
          updateData.isActive = true; // Sắp hết hàng
        }
      } else if (orderStatus === 'Đã hủy' || orderStatus === 'Hoàn trả') {
        // Tăng lại tồn kho khi đơn hàng bị hủy hoặc hoàn trả
        updateData.stock = product.stock + item.quantity;
        updateData.isActive = true; // Có hàng trở lại
      }

      // Cập nhật số lượng đã bán
      if (orderStatus === 'Đã giao hàng' || orderStatus === 'Hoàn thành') {
        updateData.soldCount = (product.soldCount || 0) + item.quantity;
      } else if (orderStatus === 'Đã hủy' || orderStatus === 'Hoàn trả') {
        // Giảm số lượng đã bán khi đơn hàng bị hủy
        updateData.soldCount = Math.max(0, (product.soldCount || 0) - item.quantity);
      }

      // Cập nhật sản phẩm
      if (Object.keys(updateData).length > 0) {
        await Product.findByIdAndUpdate(
          item.productId,
          updateData,
          { new: true, runValidators: true }
        );

        console.log(`Đã cập nhật sản phẩm ${product.name}:`, updateData);
      }
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin sản phẩm:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái sản phẩm dựa trên tồn kho
 * @param {string} productId - ID sản phẩm
 */
const updateProductStatus = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return;

    let isActive = product.isActive;
    
    if (product.stock === 0) {
      isActive = false; // Hết hàng
    } else if (product.stock <= 5) {
      isActive = true; // Sắp hết hàng nhưng vẫn bán được
    } else {
      isActive = true; // Có hàng
    }

    if (isActive !== product.isActive) {
      await Product.findByIdAndUpdate(productId, { isActive });
      console.log(`Cập nhật trạng thái sản phẩm ${product.name}: ${isActive ? 'Có hàng' : 'Hết hàng'}`);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái sản phẩm:', error);
  }
};

/**
 * Kiểm tra và cập nhật trạng thái tất cả sản phẩm
 */
const updateAllProductStatus = async () => {
  try {
    const products = await Product.find();
    
    for (const product of products) {
      await updateProductStatus(product._id);
    }
    
    console.log('Đã cập nhật trạng thái tất cả sản phẩm');
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái tất cả sản phẩm:', error);
  }
};

/**
 * Lấy thống kê tồn kho
 * @returns {Object} Thống kê tồn kho
 */
const getInventoryStats = async () => {
  try {
    const totalProducts = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const lowStock = await Product.countDocuments({ 
      stock: { $gt: 0, $lte: 5 },
      isActive: true 
    });
    const inStock = await Product.countDocuments({ 
      stock: { $gt: 5 },
      isActive: true 
    });

    return {
      totalProducts,
      outOfStock,
      lowStock,
      inStock
    };
  } catch (error) {
    console.error('Lỗi khi lấy thống kê tồn kho:', error);
    throw error;
  }
};

module.exports = {
  updateProductInventory,
  updateProductStatus,
  updateAllProductStatus,
  getInventoryStats
}; 