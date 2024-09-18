const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');

module.exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product: product });
};

module.exports.getAllProduct = async (req, res) => {
  const product = await Product.find({});
  res.status(StatusCodes.OK).json({ product });
};
