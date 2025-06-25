const Message = require('../models/Message');
const User = require('../models/User');

// API lấy danh sách user đã chat với admin
router.get('/api/messages', require('../middleware/auth').auth, async (req, res) => {
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