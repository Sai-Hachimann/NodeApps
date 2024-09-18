const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .post(
    [authenticateUser, authorizePermissions('admin')],
    productController.createProduct
  );

router
  .route('/uploadImage')
  .post(
    [authenticateUser, authorizePermissions('admin')],
    productController.uploadProduct
  );

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .patch(
    [authenticateUser, authorizePermissions('admin')],
    productController.updateProduct
  )
  .delete(
    [authenticateUser, authorizePermissions('admin')],
    productController.deleteProduct
  );

module.exports = router;
