const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product should have a name'],
      maxlength: [45, 'Name cannot be more than 45 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product should have a price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: 540,
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
      required: [true, 'Please upload an image of product'],
    },
    category: {
      type: String,
      enum: ['office', 'kitchen', 'bedroom'],
      required: [true, 'Please provide product category'],
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
      required: [true, 'Please provide a company name'],
    },
    colors: {
      type: [String],
      default: ['#999'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 9,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual('reviews', {
  ref: 'Reviews',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

ProductSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
  }
);
module.exports = mongoose.model('Products', ProductSchema);
