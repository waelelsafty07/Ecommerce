const express = require('express');
// const passport = require('passport');

const categoriesController = require('./../controllers/categoriesController');
const auth = require('./../controllers/authentication');

const router = express.Router();
require('../controllers/passport');

/* GET home page. */

router
  .route('/')
  .get(categoriesController.getAllCategories)
  .post(
    auth.protect,
    auth.restrictTo('admin'),
    categoriesController.createCategory
  );

router
  .route('/:id')
  .get(categoriesController.getCategory)
  .patch(
    auth.protect,
    auth.restrictTo('admin'),
    categoriesController.updateCategory
  )
  .delete(
    auth.protect,
    auth.restrictTo('admin'),
    categoriesController.deleteCategory
  );

module.exports = router;
