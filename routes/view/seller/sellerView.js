const express = require('express');

const router = express.Router();
const auth = require('../../../controllers/authentication');

/* GET home page. */

router.get('/', async (req, res, next) => {
  res.status(200).render('auth/login');
});

router.get(
  '/dashboard',
  auth.protect,
  auth.isLoggin,
  async (req, res, next) => {
    res.status(200).render('./dashboard/dashboard');
  }
);
// const auth = require('../controllers/authentication');

/* GET home page. */

module.exports = router;
