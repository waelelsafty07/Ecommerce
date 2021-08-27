const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.bestUsers = catchAsync(async (req, res, next) => {
  req.query.limit = '6';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'fristName,ratingsAverage,summery';
  next();
});
// Select All user Without Secret
exports.getAllusers = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(
    User.find({
      inActivate: { $ne: false },
      closeAccount: { $ne: true },
      suspended: { $ne: true }
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for Update Password. Please use /updateMyPassword'
      )
    );
  }

  // const data = await User.findById(req.user.id);

  const filterBody = filterObj(
    req.body,
    'username',
    'fristName',
    'lastName',
    'summery',
    'closeAccount',
    'imageProfile',
    'day',
    'month',
    'year',
    'gender',
    'phone',
    'email'
  );
  if (req.file) filterBody.photo = req.file.filename;

  const updateMe = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'Success',
    data: {
      user: updateMe
    }
  });
});

// Select All User Without Secret

exports.getUsersAdmin = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: 'Success',
    result: users.length,
    data: {
      users
    }
  });
});
