const express = require('express');
const auth = require('../controllers/authentication');
const usersController = require('./../controllers/usersController');
require('../controllers/passport');

const router = express.Router();
router.post('/signup', auth.signup, async (req, res, next) => {
  res.json({
    status: 'Success',
    message: 'Signup successful'
  });
});

router.post('/login', auth.login);
/* GET users listing. */
router.get('/', auth.isLoggin, usersController.getAllusers);

router.patch('/updateMyPassword', auth.protect, auth.updatePassword);

router.patch('/updateMyData', auth.protect, usersController.updateUser);

router
  .route('/best-sellers')
  .get(usersController.bestUsers, usersController.getAllusers);
router.route('/account').get(auth.protect, auth.isLoggin, (req, res, next) => {
  res.json({
    status: 'Success',
    message: 'You made it to the secure route',
    user: req.user,
    token: req.headers.authorization
  });
});
router.route('/account/:id').get(auth.isLoggin, usersController.getUser);

// router.get(
//   '/account'
//   // auth.isLoggin,
//   // auth.restrictTo('user', 'seller', 'support', 'admin'),
//   // (req, res, next) => {
//   //   res.json({
//   //     status: 'Success',
//   //     message: 'You made it to the secure route',
//   //     user: req.user,
//   //     token: req.headers.authorization
//   //   });
//   // }
// );

module.exports = router;
