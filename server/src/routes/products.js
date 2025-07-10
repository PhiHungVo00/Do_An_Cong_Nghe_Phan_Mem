const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { getInventoryStats, updateAllProductStatus } = require('../services/productUpdateService');

// Get inventory statistics (admin only)
router.get('/inventory/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = await getInventoryStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê tồn kho' });
  }
});

// Update all product statuses (admin only)
router.post('/inventory/update-status', auth, adminAuth, async (req, res) => {
  try {
    await updateAllProductStatus();
    res.json({ message: 'Đã cập nhật trạng thái tất cả sản phẩm thành công' });
  } catch (error) {
    console.error('Error updating product statuses:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái sản phẩm' });
  }
});

// Get products with low stock (admin only)
router.get('/inventory/low-stock', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      stock: { $gt: 0, $lte: 5 },
      isActive: true 
    })
    .sort({ stock: 1 })
    .skip(skip)
    .limit(limit);

    const totalProducts = await Product.countDocuments({ 
      stock: { $gt: 0, $lte: 5 },
      isActive: true 
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm sắp hết hàng' });
  }
});

// Get out of stock products (admin only)
router.get('/inventory/out-of-stock', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      stock: 0,
      isActive: false 
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalProducts = await Product.countDocuments({ 
      stock: 0,
      isActive: false 
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching out of stock products:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm hết hàng' });
  }
});

// Public routes (no authentication required)
// Get all products with pagination
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({ isActive: true });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
});

// Get featured products
router.get('/public/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      isActive: true 
    }).limit(8);
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm nổi bật' });
  }
});

// Get product by ID (public)
router.get('/public/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin sản phẩm' });
  }
});

// Get products by category
router.get('/public/categories/:category', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      category: req.params.category,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalProducts = await Product.countDocuments({ 
      category: req.params.category,
      isActive: true 
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm theo danh mục' });
  }
});

// Get all categories
router.get('/public/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh mục sản phẩm' });
  }
});

// Get all brands
router.get('/public/brands/all', async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thương hiệu sản phẩm' });
  }
});

// Admin routes (authentication required)
// Get all products with pagination
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
});

// Get single product
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin sản phẩm' });
  }
});

// Create new product
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã SKU đã tồn tại trong hệ thống' });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm mới' });
  }
});

// Update product
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã SKU đã tồn tại trong hệ thống' });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm' });
  }
});

// Delete product
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
  }
});

// Clear all products
router.delete('/clear-all', auth, adminAuth, async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.json({ 
      message: 'Đã xóa tất cả sản phẩm thành công',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error clearing products:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa tất cả sản phẩm' });
  }
});

module.exports = router; 