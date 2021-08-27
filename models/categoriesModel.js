const mongoose = require('mongoose');
const slugify = require('slugify');

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Product must have a name'],
      trim: true
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A Product must have a Image']
    },
    images: [String],
    CreatedAt: {
      type: Date,
      defult: Date.now()
    },
    secret: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
categoriesSchema.virtual('products', {
  ref: 'products',
  foreignField: 'categories',
  localField: '_id'
});

categoriesSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const categories = mongoose.model('categories', categoriesSchema);
module.exports = categories;
