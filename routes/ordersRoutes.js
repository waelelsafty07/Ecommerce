const express = require('express');
// const passport = require('passport');

const orderContoller = require('./../controllers/ordersController');
const auth = require('./../controllers/authentication');

const router = express.Router();
require('../controllers/passport');

router.post(
  '/checkout-session/',
  auth.protect,
  orderContoller.getCheckoutSession
);
module.exports = router;
