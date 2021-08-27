const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.bestProducts = catchAsync(async (req, res, next) => {
  req.query.limit = '6';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summery';
  next();
});

exports.getAllProducts = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: 'Success',
    result: products.length,
    data: {
      products
    }
  });
});

exports.getProduct = catchAsync(async (req, res) => {
  const singleProduct = await Product.findById(req.params.id).populate(
    'reviews'
  );
  res.status(200).json({
    status: 'Success',
    data: {
      singleProduct
    }
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  req.body.User = req.user._id;
  const newProduct = await Product.create(req.body);
  res.status(200).json({
    status: 'Success',
    data: {
      newProduct
    }
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const update = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'Success',
    data: {
      update
    }
  });
});
exports.deleteProduct = catchAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'Success',
    data: null
  });
});

exports.productstats = catchAsync(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 0 } }
    },
    {
      $group: {
        _id: '$ratingsAverage',
        numProduct: { $sum: 1 },
        numStock: { $sum: '$stock' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      stats
    }
  });
});
