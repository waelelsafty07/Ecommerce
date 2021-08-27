const reviews = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllreviews = catchAsync(async (req, res) => {
  // EXECUTE QUERY

  const review = await reviews.find();

  res.status(200).json({
    status: 'success',
    result: review.length,
    data: {
      review
    }
  });
});

exports.getreviews = catchAsync(async (req, res) => {
  const singlereviews = await reviews
    .findById(req.params.id)
    .populate('Products');
  res.status(200).json({
    status: 'success',
    data: {
      singlereviews
    }
  });
});

exports.createreviews = catchAsync(async (req, res) => {
  req.body.User = req.user._id;
  const newreviews = await reviews.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      newreviews
    }
  });
});

exports.updatereviews = catchAsync(async (req, res) => {
  const update = await reviews.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deletereviews = catchAsync(async (req, res) => {
  await reviews.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: null
  });
});
