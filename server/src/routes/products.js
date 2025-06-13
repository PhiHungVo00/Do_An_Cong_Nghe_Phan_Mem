const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get all products with pagination and filtering
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category;
    const brand = req.query.brand;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }

    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name', 'description', 'price', 'stock', 'category', 
    'brand', 'image', 'rating', 'reviews', 'specifications', 
    'warranty', 'isActive'
  ];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Cập nhật không hợp lệ' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    updates.forEach(update => product[update] = req.body[update]);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    product.isActive = false;
    await product.save();
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product categories
router.get('/categories/all', auth, async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product brands
router.get('/brands/all', auth, async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product stock
router.patch('/:id/stock', auth, async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (operation === 'add') {
      product.stock += quantity;
    } else if (operation === 'subtract') {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Số lượng tồn kho không đủ' });
      }
      product.stock -= quantity;
    } else {
      return res.status(400).json({ message: 'Thao tác không hợp lệ' });
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Clear all products
router.delete('/clear-all', auth, async (req, res) => {
  try {
    console.log('Attempting to clear all products...');
    
    // Kiểm tra xem có sản phẩm nào không
    const count = await Product.countDocuments({});
    console.log(`Found ${count} products to delete`);

    if (count === 0) {
      return res.json({ message: 'Không có sản phẩm nào để xóa' });
    }

    // Xóa tất cả sản phẩm
    const result = await Product.deleteMany({});
    console.log('Delete result:', result);

    if (result.deletedCount === count) {
      res.json({ 
        message: 'Đã xóa tất cả sản phẩm thành công',
        deletedCount: result.deletedCount
      });
    } else {
      throw new Error(`Chỉ xóa được ${result.deletedCount}/${count} sản phẩm`);
    }
  } catch (error) {
    console.error('Error clearing products:', error);
    res.status(500).json({ 
      message: 'Lỗi khi xóa sản phẩm',
      error: error.message
    });
  }
});

module.exports = router; 