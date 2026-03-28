// Product Model
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  oldPrice: {
    type: Number,
    default: 0
  },
  image: String,
  category: {
    type: String,
    enum: ['telefon', 'elektronika', 'kitoblar', 'kiyim', 'oziq', 'sog'],
    default: 'elektronika'
  },
  stock: {
    type: Number,
    default: 100
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: [{
    user: mongoose.Schema.Types.ObjectId,
    comment: String,
    rating: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
