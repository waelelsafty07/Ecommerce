const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const passport = require('passport');
// const JWTstrategy = require('passport-jwt').Strategy;
// const { ExtractJwt } = require('passport-jwt');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createSentToken = async (body, req, res) => {
  const token = jwt.sign({ user: body }, 'TOP_SECRET', {
    expiresIn: '90d'
  });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  return res.json({ status: 'Success', token });
};

exports.signup = passport.authenticate('signup', { session: false });

exports.protect = async (req, res, next) => {
  // 1) getting token and check of it's there
  passport.authenticate('jwt', { session: false });
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (token === 'null') {
    return next(new AppError('token is null', 401));
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in!, Please log in to get access', 401)
    );
  }
  // 2) verification token
  const decode = await promisify(jwt.verify)(token, 'TOP_SECRET');
  // 3) check if user still exists
  const currentUser = await User.findById(decode.user._id);
  // console.log(decode.user._id);

  if (!currentUser) {
    return next(
      new AppError('The User belonging to this token is not available', 401)
    );
  }
  // 4) check if user change password afte jwt was issued
  if (currentUser.passwordChangeAtAfter(decode.iat)) {
    return next(
      new AppError('User Recently Changed Password! Please log in again', 401)
    );
  }
  // Grant Acsess Protect Route
  req.user = currentUser;
  next();
};

exports.isLoggin = async (req, res, next) => {
  // 1) getting token and check of it's there

  // console.log(req.cookies.jwt);
  if (req.cookies.jwt) {
    const decode = await promisify(jwt.verify)(req.cookies.jwt, 'TOP_SECRET');
    // 3) check if user still exists
    const currentUser = await User.findById(decode.user._id);

    if (!currentUser) {
      return next();
    }
    // 4) check if user change password afte jwt was issued
    if (currentUser.passwordChangeAtAfter(decode.iat)) {
      return next();
    }
    // Grant Acsess Protect Route
    // req.user = currentUser;
    // res.locals.user = currentUser;
    res.locals.user = currentUser;
    console.log(req.user);
    return next();
  }
  next();
};
exports.login = async (req, res, next) => {
  passport.authenticate(
    'login',
    {
      failureFlash: true
    },
    catchAsync(async function(err, user, failuresOrInfo) {
      if (err || !user) {
        return next(new AppError(failuresOrInfo.message, 404));
      }

      req.login(user, { session: false }, async error => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email, role: user.role };
        // Create Token
        createSentToken(body, req, res);
      });
    })
  )(req, res, next);
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get User from Database
  const user = await User.findById(req.user._id).select('+password');
  console.log(req.user._id);
  // 2) Check if posted Current password is Correct
  const correct = await user.isValidPassword(
    req.body.passwordCurrent,
    user.password
  );
  if (!correct) {
    return next(new AppError('Your current password is Wrong.', 401));
  }
  // 3) if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log User in, send jwt
  const body = { _id: user._id, email: user.email, role: user.role };
  createSentToken(body, req, res);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
