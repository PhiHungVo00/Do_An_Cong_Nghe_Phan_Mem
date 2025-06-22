const express = require('express');
const router = express.Router();
const SalesEvent = require('../models/SalesEvent');
const { auth } = require('../middleware/auth');

// Public routes for user frontend (no authentication required)
// Get all sales events (public)
router.get('/public', async (req, res) => {
  try {
    const events = await SalesEvent.find({ status: 'active' })
      .sort({ startDate: 1 })
      .limit(10);
    res.json(events);
  } catch (error) {
    console.error('Error fetching public sales events:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sự kiện' });
  }
});

// Get single sales event (public)
router.get('/public/:id', async (req, res) => {
  try {
    const event = await SalesEvent.findById(req.params.id);
    if (!event || event.status !== 'active') {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching public sales event:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin sự kiện' });
  }
});

// Get all sales events with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await SalesEvent.find()
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    const totalEvents = await SalesEvent.countDocuments();

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents
    });
  } catch (error) {
    console.error('Error fetching sales events:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sự kiện' });
  }
});

// Get events by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Vui lòng cung cấp khoảng thời gian' });
    }

    const events = await SalesEvent.find({
      startDate: { $gte: new Date(start) },
      endDate: { $lte: new Date(end) }
    }).sort({ startDate: 1 });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events by range:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sự kiện theo khoảng thời gian' });
  }
});

// Add new sales event
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      type,
      status,
      location,
      participants,
      budget,
      notes
    } = req.body;

    const event = new SalesEvent({
      title,
      description,
      startDate,
      endDate,
      type,
      status,
      location,
      participants,
      budget,
      notes,
      createdBy: req.user._id
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating sales event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo sự kiện mới' });
  }
});

// Update sales event
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      type,
      status,
      location,
      participants,
      budget,
      notes
    } = req.body;
    const eventId = req.params.id;

    const event = await SalesEvent.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        startDate,
        endDate,
        type,
        status,
        location,
        participants,
        budget,
        notes
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error updating sales event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật sự kiện' });
  }
});

// Delete sales event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await SalesEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    res.json({ message: 'Đã xóa sự kiện thành công' });
  } catch (error) {
    console.error('Error deleting sales event:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa sự kiện' });
  }
});

module.exports = router; 