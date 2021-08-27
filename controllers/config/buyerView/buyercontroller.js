const Order = require('../../../models/orderModel');
const catchAsync = require('../../../utils/catchAsync');
// const APIFeatures = require('../../../utils/apiFeatures');

exports.getorders = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const Orders = await Order.find({ Buyer: req.user._id });
  
  console.log(Orders);
  res.status(200).render('dashboard/profile/myorder', {
    Orders: Orders
  });
});
