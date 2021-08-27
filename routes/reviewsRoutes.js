const express = require('express');
// const passport = require('passport');

const reviewsController = require('./../controllers/reviewsController');
const auth = require('./../controllers/authentication');

const router = express.Router();
require('../controllers/passport');

/* GET home page. */

router
  .route('/')
  .get(reviewsController.getAllreviews)
  .post(auth.protect, auth.restrictTo('user'), reviewsController.createreviews);

router
  .route('/:id')
  .get(reviewsController.getreviews)
  .patch(auth.protect, auth.restrictTo('user'), reviewsController.updatereviews)
  .delete(
    auth.protect,
    auth.restrictTo('user'),
    reviewsController.deletereviews
  );

module.exports = router;
