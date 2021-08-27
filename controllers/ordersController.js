const orders = require('../models/orderModel');
const Cart = require('../models/cart');
const catchAsync = require('../utils/catchAsync');

function orderNumber() {
  let now = Date.now().toString(); // '1492341545873'
  // pad with extra random digit
  now += now + Math.floor(Math.random() * 10);
  // format
  return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join('-');
}

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  if (!req.session.cart) return res.render('error', { msg: 'Cart is empty' });
  const cart = new Cart(req.session.cart);

  // const order = await orders.create(req.body);
  // const ProductID = [];
  // const SellerID = [];
  const orderID = orderNumber();
  for (let i = 0; i < cart.generateArray().length; i += 1) {
    orders.create({
      Buyer: req.user._id,
      Products: cart.generateArray()[i].item._id,
      Seller: cart.generateArray()[i].item.User._id,
      qty: cart.generateArray()[i].qty,
      price: cart.generateArray()[i].price,
      orderId: orderID
    });
  }
  // res.locals.orderID = orderID;
  req.session.destroy();
  res.redirect(`/products/cart/checkout/done?orderid=${orderID}`);
});
