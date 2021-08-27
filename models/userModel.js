// const crypto = require('crypto');
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female']
    },
    day: {
      type: Number
    },
    month: {
      type: Number
    },
    year: {
      type: Number
    },
    phone: {
      type: Number
    },
    fristName: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'A user must have a Email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      defult: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    imageProfile: {
      type: String
    },
    CreatedAt: {
      type: Date,
      defult: Date.now()
    },
    summery: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    inActivate: {
      type: Boolean,
      default: false
    },
    inActivateResetToken: String,
    inActivateExpires: Date,
    suspended: {
      type: Boolean,
      default: false
    },
    closeAccount: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'support', 'admin'],
      default: 'user'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre('save', function(next) {
  if (this.username) this.slug = slugify(this.username, { lower: true });
  this.slug = this._id;
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.passwordChangeAtAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};
userSchema.methods.isValidPassword = async function(password, userPassword) {
  const compare = await bcrypt.compare(password, userPassword);

  return compare;
};

const User = mongoose.model('Users', userSchema);
module.exports = User;
