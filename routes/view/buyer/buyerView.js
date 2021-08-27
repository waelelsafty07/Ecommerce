const express = require('express');

const auth = require('../../../controllers/authentication');
const buyercontroller = require('../../../controllers/config/buyerView/buyercontroller');

const router = express.Router();

/* GET home page. */

router.get('/login', auth.isLoggin, async (req, res, next) => {
  if (req.user) return res.redirect('/');
  res.status(200).render('./auth/login');
});

router.get(
  '/dashboard',
  auth.protect,
  auth.isLoggin,
  auth.restrictTo('user'),
  async (req, res, next) => {
    console.log(req.user);
    res.status(200).render('./dashboard/dashboard');
  }
);

router.get(
  '/dashboard/myprofile',
  auth.protect,
  auth.isLoggin,
  auth.restrictTo('user'),

  async (req, res, next) => {
    console.log(req.user);
    res.status(200).render('./dashboard/profile/myprofile');
  }
);

router.get(
  '/dashboard/myprofile/editeprofile',
  auth.protect,
  auth.isLoggin,
  auth.restrictTo('user'),
  async (req, res, next) => {
    console.log(req.user);
    res.status(200).render('./dashboard/profile/editeprofile');
  }
);

router.get(
  '/dashboard/myorders',
  auth.protect,
  auth.isLoggin,
  auth.restrictTo('user'),
  buyercontroller.getorders
);
// const auth = require('../controllers/authentication');

/* GET home page. */

module.exports = router;
