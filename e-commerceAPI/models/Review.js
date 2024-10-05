const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide a review title'],
      maxlength: 99,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment about the product'],
      maxlength: 999,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

//user can leave one review per product (compound index is the way to go)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Reviews', ReviewSchema);
