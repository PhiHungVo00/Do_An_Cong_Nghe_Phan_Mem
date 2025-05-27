const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0,
  },
  specifications: {
    type: String,
    required: true,
    trim: true,
  },
  warranty: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  images: [{
    type: String,
    trim: true,
  }],
  supplier: {
    type: String,
    trim: true,
  },
  barcode: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema); 