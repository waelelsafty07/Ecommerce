const categories = require('../models/categoriesModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCategories = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(categories.find(), req.query);

  const Categories = await features.query;

  res.status(200).json({
    status: 'Success',
    result: Categories.length,
    data: {
      Categories
    }
  });
});

exports.getCategory = catchAsync(async (req, res) => {
  const singleCategories = await categories.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      singleCategories
    }
  });
});

exports.createCategory = catchAsync(async (req, res) => {
  const newCategory = await categories.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      newCategory
    }
  });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const update = await categories.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      update
    }
  });
});
exports.deleteCategory = catchAsync(async (req, res) => {
  await categories.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: null
  });
});
