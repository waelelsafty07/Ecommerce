const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Product must have a name'],
      trim: true
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
    wishlist: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A Product must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < 100;
        },
        message: 'Discount price ({VALUE}) should be below regular 100%'
      }
    },
    stock: {
      type: Number,
      required: [
        true,
        'It must contain the quantities of the product that you have availablee'
      ]
    },
    summery: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A Product must have a Image']
    },
    images: [String],
    dateOfProduction: {
      type: Date
    },
    ExpiryDate: {
      type: Date
    },
    secret: {
      type: Boolean,
      default: false
    },
    Categories: {
      type: mongoose.Schema.ObjectId,
      ref: 'categories',
      required: [true, ' Must have a Category']
    },
    User: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, ' Must have a User']
    },
    CreatedAt: {
      type: Date,
      defult: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'Categories',
    select: '-__v -slug'
  }).populate({
    path: 'User',
    select: 'id fristName lastName'
  });
  next();
});

productSchema.virtual('reviews', {
  ref: 'reviews',
  foreignField: 'Products',
  localField: '_id'
});
// productSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretCourses: { $ne: true } } });
//   next();
// });
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
