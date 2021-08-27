const Cart = require('../../models/cart');
const Product = require('../../models/productModel');

exports.cartfunc = async (req, res, next) => {
  // console.log(req.user);
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
  const product = await Product.findById(productId);
  // if (!product) { return );}
  cart.add(product, productId);
  req.session.cart = cart;
  // console.log('req.session.cart.items');

  // console.log(cart.generateArray());
  res.locals.products = cart.generateArray();
  res.locals.totalPrice = cart.totalPrice;
  // console.log(res.locals.products);
  res.redirect('/');
};

exports.cartproduct = async (req, res, next) => {
  // console.log(req.user);
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
  const product = await Product.findById(productId);
  // if (!product) { return );}
  cart.add(product, productId);
  req.session.cart = cart;
  // console.log('req.session.cart.items');

  // console.log(cart.generateArray());
  res.locals.products = cart.generateArray();
  res.locals.totalPrice = cart.totalPrice;
  // console.log(res.locals.products);
  res.redirect('/products');
};

exports.cartproduct = async (req, res, next) => {
  // console.log(req.user);
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
  const product = await Product.findById(productId);
  // if (!product) { return );}
  cart.add(product, productId);
  req.session.cart = cart;
  // console.log('req.session.cart.items');

  // console.log(cart.generateArray());
  res.locals.products = cart.generateArray();
  res.locals.totalPrice = cart.totalPrice;
  // console.log(res.locals.products);
  res.redirect('/products');
};

exports.cartView = async (req, res, next) => {
  // console.log(req.user);
  if (!req.session.cart) {
    return res.render('products/cart', { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('products/cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
};

exports.checkoutView = async (req, res, next) => {
  // console.log(req.user);
  if (!req.session.cart) return res.redirect('/products');

  const cart = new Cart(req.session.cart);
  res.render('products/checkout', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
};
