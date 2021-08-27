const express = require('express');
// const passport = require('passport');

const productContoller = require('./../controllers/productContoller');
const auth = require('./../controllers/authentication');

const router = express.Router();
require('../controllers/passport');

router
  .route('/best-products')
  .get(productContoller.bestProducts, productContoller.getAllProducts);
router.route('/stats').get(productContoller.productstats);

router
  .route('/')
  .get(productContoller.getAllProducts)
  .post(
    auth.protect,
    auth.restrictTo('seller', 'support', 'admin'),
    productContoller.createProduct
  );

router
  .route('/:id')
  .get(productContoller.getProduct)
  .patch(
    auth.protect,
    auth.restrictTo('seller', 'support', 'admin'),
    productContoller.updateProduct
  )
  .delete(
    auth.protect,
    auth.restrictTo('seller', 'support', 'admin'),
    productContoller.deleteProduct
  );

module.exports = router;
