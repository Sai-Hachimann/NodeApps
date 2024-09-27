const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a valid name'],
    minlength: 3,
    maxlength: 45,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
    required: [true, 'A product should have a valid rating from 1 - 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} not supported',
    },
    // enum: ['ikea', 'liddy', 'caressa', 'marcos']
  },
});

module.exports = mongoose.model('Products', ProductsSchema);
