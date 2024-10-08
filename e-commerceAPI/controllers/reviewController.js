const Reviews = require('../models/Review');
const Products = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const productId = req.body.product;
  req.body.user = req.user.userId;
  const isProductValid = await Products.findOne({ _id: productId });

  if (!isProductValid) {
    throw new CustomError.NotFoundError('No product found');
  }

  const alreadyReviewed = await Reviews.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadyReviewed) {
    throw new CustomError.BadRequestError('Already written a review');
  }

  const review = await Reviews.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Reviews.find({}).populate({
    path: 'product',
    select: 'name company price',
  });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  // console.log(reviewId);
  const review = await Reviews.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { title, comment, rating } = req.body;
  if (!title | !comment | !rating) {
    throw new CustomError.BadRequestError('provide fields to write a review');
  }
  if (!reviewId) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  const review = await Reviews.findOne({ _id: reviewId });
  review.title = title;
  review.comment = comment;
  review.rating = rating;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  if (!reviewId) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  const review = await Reviews.findOne({ _id: reviewId });
  checkPermissions(req.user, review.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Deleted the review' });
};

const getSingleProductReview = async (req, res) => {
  const productId = req.params.id;
  const reviews = await Reviews.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
