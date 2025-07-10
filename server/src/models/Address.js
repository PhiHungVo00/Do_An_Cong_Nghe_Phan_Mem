const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  // Thông tin cơ bản
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    default: ''
  },
  full_name: {
    type: String,
    required: true
  },
  full_name_en: {
    type: String,
    default: ''
  },
  
  // Phân cấp hành chính
  administrative_unit_id: {
    type: Number,
    required: false,
    default: null
  },
  administrative_region_id: {
    type: Number,
    required: false,
    default: null
  },
  
  // Cấp hành chính (1: Tỉnh/TP, 2: Quận/Huyện, 3: Xã/Phường)
  level: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  
  // Mã cấp cha (để tạo quan hệ phân cấp)
  parent_code: {
    type: String,
    default: null,
    index: true
  },
  
  // Thông tin bổ sung
  is_active: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes để tối ưu query
addressSchema.index({ level: 1, is_active: 1 });
addressSchema.index({ parent_code: 1, is_active: 1 });
addressSchema.index({ name: 'text', full_name: 'text' });

// Virtual để lấy thông tin cấp cha
addressSchema.virtual('parent', {
  ref: 'Address',
  localField: 'parent_code',
  foreignField: 'code',
  justOne: true
});

// Virtual để lấy danh sách con
addressSchema.virtual('children', {
  ref: 'Address',
  localField: 'code',
  foreignField: 'parent_code'
});

// Method để lấy địa chỉ con
addressSchema.methods.getChildren = function() {
  return this.model('Address').find({ 
    parent_code: this.code, 
    is_active: true 
  }).sort({ name: 1 });
};

// Method để lấy địa chỉ cha
addressSchema.methods.getParent = function() {
  if (!this.parent_code) return null;
  return this.model('Address').findOne({ 
    code: this.parent_code, 
    is_active: true 
  });
};

// Static method để lấy tất cả tỉnh/thành phố
addressSchema.statics.getProvinces = function() {
  return this.find({ 
    level: 1, 
    is_active: true 
  }).sort({ name: 1 });
};

// Static method để lấy quận/huyện theo tỉnh/thành phố
addressSchema.statics.getDistricts = function(provinceCode) {
  return this.find({ 
    parent_code: provinceCode, 
    level: 2, 
    is_active: true 
  }).sort({ name: 1 });
};

// Static method để lấy xã/phường theo quận/huyện
addressSchema.statics.getWards = function(districtCode) {
  return this.find({ 
    parent_code: districtCode, 
    level: 3, 
    is_active: true 
  }).sort({ name: 1 });
};

// Static method để tìm kiếm địa chỉ
addressSchema.statics.searchAddress = function(query) {
  return this.find({
    $and: [
      { is_active: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { full_name: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  }).limit(10);
};

module.exports = mongoose.model('Address', addressSchema); 