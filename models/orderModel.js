const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    Buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, ' Must have a User']
    },
    qty: {
      type: Number,
      defualt: 1
    },
    price: {
      type: Number,
      defualt: 1
    },
    shipping: {
      type: String,
      enum:['shipped', 'processing', 'delivered'],
      default: 'processing'
    },
    totalQty: {
      type: Number,
      defualt: 1
    },
    totalPrice: {
      type: Number
    },
    Seller: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, ' Must have a User']
      }
    ],
    Products: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, ' Must have a User']
    },
    orderId: {
      type: String,
      required: [true, ' Must have a Order']
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

orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'Buyer',
    select: '-__v -slug'
  })
    .populate({
      path: 'Seller',
      select: '-__v -slug'
    })
    .populate({
      path: 'Products',
      select: '-__v -slug'
    });
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
