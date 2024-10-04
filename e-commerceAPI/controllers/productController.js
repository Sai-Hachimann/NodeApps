const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomErrors = require('../errors');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProduct = async (req, res) => {
  res.send('getAll product');
};
const getSingleProduct = async (req, res) => {
  res.send('getSingle product');
};
const updateProduct = async (req, res) => {
  res.send('update product');
};
const deleteProduct = async (req, res) => {
  res.send('delete product');
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
