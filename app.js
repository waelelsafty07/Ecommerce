// const createError = require('http-errors');
// const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const path = require('path');
// const flash = require('connect-flash');
const indexRouter = require('./routes/view/index');
const productsRouter = require('./routes/view/ProductsView');
const buyerRouter = require('./routes/view/buyer/buyerView');
const vendorRouter = require('./routes/view/seller/sellerView');

const usersRouter = require('./routes/users');
const AppError = require('./utils/appError');
const ErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const CategoryRouter = require('./routes/categoriesRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const orderRoutes = require('./routes/ordersRoutes');
// const dashRouter = require('./routes/dashboardRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.use('public', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'development') app.use(logger('dev'));

app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: true
  })
);
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/buyer', buyerRouter);
app.use('/seller', vendorRouter);
app.use('/orders', orderRoutes);

// app.use('/dashboard', dashRouter);
// app.use('/api/categories', categoriesRouter);

app.use('/api/users', usersRouter);
app.use('/api/products', productRouter);
app.use('/api/seller', sellerRoutes);
app.use('/api/category', CategoryRouter);
app.use('/api/reviews', reviewRoutes);

// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(ErrorHandler);

module.exports = app;
