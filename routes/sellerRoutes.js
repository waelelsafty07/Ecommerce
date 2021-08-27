const express = require('express');
const auth = require('../controllers/authentication');
const usersController = require('./../controllers/usersController');
require('../controllers/passport');

const router = express.Router();
router
  .route('/best-sellers')
  .get(usersController.bestUsers, usersController.getAllusers);
const roleMiddleware = async (req, res, next) => {
  req.body.role = 'seller';
  next();
};

router
  .route('/signup')
  .post(roleMiddleware, auth.signup, async (req, res, next) => {
    res.json({
      status: 'Success',
      message: 'Signup successful'
    });
  });
router.route('/login').post(auth.login);

router.get(
  '/dashboard',
  auth.protect,
  auth.isLoggin,
  auth.restrictTo('seller', 'support', 'admin'),
  (req, res, next) => {
    res.json({
      status: 'Success',
      message: 'You made it to the secure route',
      user: req.user,
      token: req.headers.authorization
    });
  }
);

module.exports = router;
