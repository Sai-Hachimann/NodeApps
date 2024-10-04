const Products = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomErrors = require('../errors');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Products.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProduct = async (req, res) => {
  const product = await Products.find({});
  res.status(StatusCodes.OK).json({ product, count: product.length });
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Products.findOne({ _id: productId });
  if (!product) {
    throw new CustomErrors.NotFoundError(`no product with this ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Products.findOneAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomErrors.NotFoundError(`no product with this ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  // const product = await Products.findOneAndDelete({ _id: productId });

  const product = await Products.findOne({ _id: productId });
  if (!product) {
    throw new CustomErrors.NotFoundError(`no product with this ${productId}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'deleted product' });
};

const uploadImage = async (req, res) => {
  res.send('upload product');
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
