const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes for user frontend (no authentication required)
// Lấy tất cả thử thách public
router.get('/public', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isPublic: true }).sort({ startDate: 1 });
    res.json(challenges);
  } catch (err) {
    console.error('Error fetching public challenges:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách thử thách' });
  }
});

// Get single challenge (public)
router.get('/public/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.isPublic || challenge.status !== 'active') {
      return res.status(404).json({ message: 'Không tìm thấy thử thách' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching public challenge:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin thử thách' });
  }
});

// Admin routes (authentication required)
// Get all challenges with pagination
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const challenges = await Challenge.find()
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    const totalChallenges = await Challenge.countDocuments();

    res.json({
      challenges,
      currentPage: page,
      totalPages: Math.ceil(totalChallenges / limit),
      totalChallenges
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách thử thách' });
  }
});

// Get single challenge
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Không tìm thấy thử thách' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new challenge
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const challenge = new Challenge({
      ...req.body,
      createdBy: req.user._id
    });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo thử thách mới' });
  }
});

// Update challenge
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({ message: 'Không tìm thấy thử thách' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật thử thách' });
  }
});

// Delete challenge
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Không tìm thấy thử thách' });
    }
    res.json({ message: 'Đã xóa thử thách thành công' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa thử thách' });
  }
});

module.exports = router; 