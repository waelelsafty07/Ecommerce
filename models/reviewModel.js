const mongoose = require('mongoose');
// const slugify = require('slugify');
const product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A Product must have a name'],
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    Products: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true]
    },
    User: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true]
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

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'Products',
    select: '-__v'
  }).populate({
    path: 'User',
    select: 'id fristName lastName'
  });
  next();
});

reviewSchema.pre('save', async function(next) {
  this.CreatedAt = Date.now();
});

reviewSchema.index({ Products: 1, User: 1 }, { unique: true });
reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { Products: productId }
    },
    {
      $group: {
        _id: '$Products',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.Products);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.Products);
});

const review = mongoose.model('reviews', reviewSchema);
module.exports = review;
