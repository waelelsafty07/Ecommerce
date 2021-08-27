const express = require('express');

const router = express.Router();

// const productController = require('../controllers/productContoller');
// const auth = require('../controllers/authentication');

/* GET home page. */

router.get('/', async (req, res, next) => {
  res.status(200).render('./dashboard/dashboard');
});

module.exports = router;
