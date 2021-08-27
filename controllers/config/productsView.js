const Product = require('../../models/productModel');
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');

exports.getAllProducts = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;
  // console.log(products.Categories);

  res.status(200).render('./products/products', {
    status: 'Success',
    result: products.length,
    products
  });
});
exports.getProduct = catchAsync(async (req, res) => {
  const singleProduct = await Product.findById(req.params.id).populate({
    path: 'reviews',
    select: '-__v'
  });
  console.log(singleProduct);
  res.status(200).render('./products/productDetails', {
    status: 'Success',
    data: {
      singleProduct
    }
  });
});
