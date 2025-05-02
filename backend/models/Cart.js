// models/Cart.js
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  name: {
    type: String,
    required: true  // Name of the product
  },
  image: {
    type: String,  // Stores the image URL
    required: false  // Optional
  }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Calculate cart total
CartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    // Use offer price if product is on sale, otherwise use regular price
    const price = item.product.onSale ? item.product.offerPrice : item.product.price;
    return total + (price * item.quantity);
  }, 0);
};

module.exports = mongoose.model("Cart", CartSchema);

