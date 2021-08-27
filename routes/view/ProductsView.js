const express = require('express');

const router = express.Router();

const productController = require('../../controllers/config/productsView');
const auth = require('../../controllers/authentication');
const cartController = require('../../controllers/config/cart');
// const orderController = require('../../controllers/config/cart');

router.get('/', auth.isLoggin, productController.getAllProducts);
router.get('/cart', auth.isLoggin, cartController.cartView);
router.get('/:id/', auth.isLoggin, productController.getProduct);
router.get('/add-to-cart/:id', auth.isLoggin, cartController.cartproduct);
router.get('/cart/checkout', auth.isLoggin, cartController.checkoutView);
router.get('/cart/checkout/done', auth.protect, (req, res, next) => {
  if (!req.query.orderid)
    return res.render('error', {
      msg: 'Contact to Support'
    });

  res.render('checkoutDone', {
    msg: req.query.orderid
  });
});
module.exports = router;
