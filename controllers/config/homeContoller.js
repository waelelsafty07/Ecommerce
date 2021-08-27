const Product = require('../../models/productModel');
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');

exports.topTrending = catchAsync(async (req, res) => {
  req.query.limit = '6';
  req.query.sort = '-ratingsAverage,price';
  // req.query.fields = 'name,price,ratingsAverage';
  // EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  // console.log(products);
  res.status(200).render('index', {
    products
  });
});
