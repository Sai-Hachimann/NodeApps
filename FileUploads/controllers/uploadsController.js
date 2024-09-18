const { StatusCodes } = require('http-status-codes');
const path = require('path');
const CustomError = require('../errors');

module.exports.uploadProductImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No file was uploaded');
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload an Image');
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload an image below max size'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};
