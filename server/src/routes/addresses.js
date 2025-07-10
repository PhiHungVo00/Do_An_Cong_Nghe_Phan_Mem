const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

// GET /api/addresses/provinces - Lấy danh sách tỉnh/thành phố
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await Address.getProvinces();
    res.json({
      success: true,
      data: provinces
    });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tỉnh/thành phố'
    });
  }
});

// GET /api/addresses/districts/:provinceCode - Lấy danh sách quận/huyện theo tỉnh/thành phố
router.get('/districts/:provinceCode', async (req, res) => {
  try {
    const { provinceCode } = req.params;
    const districts = await Address.getDistricts(provinceCode);
    res.json({
      success: true,
      data: districts
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách quận/huyện'
    });
  }
});

// GET /api/addresses/wards/:districtCode - Lấy danh sách xã/phường theo quận/huyện
router.get('/wards/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const wards = await Address.getWards(districtCode);
    res.json({
      success: true,
      data: wards
    });
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách xã/phường'
    });
  }
});

// GET /api/addresses/search - Tìm kiếm địa chỉ
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const results = await Address.searchAddress(q.trim());
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error searching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm địa chỉ'
    });
  }
});

// GET /api/addresses/:code - Lấy thông tin chi tiết địa chỉ
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const address = await Address.findOne({ code, is_active: true });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin địa chỉ'
    });
  }
});

// GET /api/addresses/:code/children - Lấy danh sách địa chỉ con
router.get('/:code/children', async (req, res) => {
  try {
    const { code } = req.params;
    const address = await Address.findOne({ code, is_active: true });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }
    
    const children = await address.getChildren();
    res.json({
      success: true,
      data: children
    });
  } catch (error) {
    console.error('Error fetching address children:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách địa chỉ con'
    });
  }
});

// GET /api/addresses/:code/parent - Lấy thông tin địa chỉ cha
router.get('/:code/parent', async (req, res) => {
  try {
    const { code } = req.params;
    const address = await Address.findOne({ code, is_active: true });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }
    
    const parent = await address.getParent();
    res.json({
      success: true,
      data: parent
    });
  } catch (error) {
    console.error('Error fetching address parent:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin địa chỉ cha'
    });
  }
});

module.exports = router; 