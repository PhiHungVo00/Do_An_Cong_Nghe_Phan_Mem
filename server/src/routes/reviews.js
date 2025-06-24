const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

// Lấy danh sách review, hỗ trợ lọc theo orderId, phân trang
router.get('/', async (req, res) => {
  try {
    const { orderId, page = 1, limit = 10 } = req.query;
    const filter = orderId ? { orderId } : {};
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ reviews, total });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đánh giá' });
  }
});

// Phản hồi review (chỉ shop mới được phản hồi)
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || typeof reply !== 'string') {
      return res.status(400).json({ message: 'Nội dung phản hồi không hợp lệ' });
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }
    review.reply = reply;
    review.repliedAt = new Date();
    await review.save();
    res.json({ message: 'Phản hồi thành công', review });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi phản hồi đánh giá' });
  }
});

// Tạo đánh giá shop
router.post('/shop', auth, async (req, res) => {
  try {
    const { rating, content } = req.body;
    if (!rating || !content) {
      return res.status(400).json({ message: 'Thiếu thông tin đánh giá' });
    }
    const review = new Review({
      userId: req.user._id,
      customerName: req.user.fullName || req.user.email,
      customerAvatar: req.user.avatar || '',
      rating,
      content,
      // Không có productId
    });
    await review.save();
    res.status(201).json({ message: 'Đánh giá shop thành công', review });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi tạo đánh giá shop' });
  }
});

// Lấy danh sách đánh giá shop
router.get('/shop', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { productId: { $exists: false } };
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ reviews, total });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy đánh giá shop' });
  }
});

module.exports = router; 