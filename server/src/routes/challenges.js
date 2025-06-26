const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// Lấy tất cả thử thách public
router.get('/public', async (req, res) => {
  try {
    const challenges = await Challenge.find({}).sort({ startDate: 1 });
    res.json({ challenges });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách thử thách' });
  }
});

module.exports = router; 