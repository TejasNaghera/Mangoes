const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String, // Store image filename or URL
  price: Number,
  offerPrice: Number,

  availableStock: {
    type: Number,
    required: true,
    default:10
  },
  onSale: Boolean,
});

module.exports = mongoose.model("Product", productSchema);
