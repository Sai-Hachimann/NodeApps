const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadsController = require('../controllers/uploadsController');

router
  .route('/')
  .post(productController.createProduct)
  .get(productController.getAllProduct);
router.route('/uploads').post(uploadsController.uploadProductImage);

module.exports = router;
