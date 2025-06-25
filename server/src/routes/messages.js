const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Lấy lịch sử chat giữa user và admin
router.get('/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;
  const messages = await Message.find({
    $or: [
      { from: myId, to: userId },
      { from: userId, to: myId }
    ]
  }).sort({ createdAt: 1 });
  res.json({ messages });
});

// Gửi tin nhắn
router.post('/', auth, async (req, res) => {
  const { to, content } = req.body;
  const from = req.user._id;
  if (!to || !content) return res.status(400).json({ message: 'Thiếu thông tin' });
  const message = new Message({ from, to, content });
  await message.save();
  res.status(201).json({ message });
});

// Lấy danh sách user đã chat với admin
router.get('/', auth, async (req, res) => {
  const myId = req.user._id;
  // Lấy tất cả các user đã chat với admin (distinct from/to)
  const messages = await Message.find({ $or: [{ from: myId }, { to: myId }] });
  const userIds = new Set();
  messages.forEach(m => {
    if (m.from.toString() !== myId.toString()) userIds.add(m.from.toString());
    if (m.to.toString() !== myId.toString()) userIds.add(m.to.toString());
  });
  const users = await User.find({ _id: { $in: Array.from(userIds) } }, 'fullName email avatar');
  res.json({ users });
});

module.exports = router; 