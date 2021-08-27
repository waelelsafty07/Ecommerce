// const mongoose = require('mongoose');
// const slugify = require('slugify');

// const productSchema = new mongoose.Schema(
//   {
//     fristName: {
//       type: String,
//       required: true
//     },
//     lastName: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true
//     },
//     phone: {
//       type: String,
//       required: true
//     },
//     street: [
//       {
//         type: String
//       }
//     ],
//     Country:{
//       type: String,
//       required: true
//     },
    
//     User: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Users',
//       required: [true, ' Must have a User']
//     },
//     CreatedAt: {
//       type: Date,
//       defult: Date.now
//     }
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );
// productSchema.index({ price: 1, ratingsAverage: -1 });
// productSchema.index({ slug: 1 });

// productSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'Categories',
//     select: '-__v -slug'
//   }).populate({
//     path: 'User',
//     select: 'id fristName lastName'
//   });
//   next();
// });

// productSchema.virtual('reviews', {
//   ref: 'reviews',
//   foreignField: 'Products',
//   localField: '_id'
// });
// // productSchema.pre('aggregate', function(next) {
// //   this.pipeline().unshift({ $match: { secretCourses: { $ne: true } } });
// //   next();
// // });
// productSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// const Product = mongoose.model('Product', productSchema);
// module.exports = Product;
