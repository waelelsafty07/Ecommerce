const express = require('express');

const router = express.Router();
const auth = require('./../../controllers/authentication');

const homeController = require('../../controllers/config/homeContoller');
const cartController = require('../../controllers/config/cart');
/* GET home page. */

router.get('/', auth.isLoggin, homeController.topTrending);

router.get('/add-to-cart/:id', auth.isLoggin, cartController.cartfunc);
// const auth = require('../controllers/authentication');

/* GET home page. */

module.exports = router;
