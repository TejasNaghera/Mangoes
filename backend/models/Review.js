const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // orderId: String,
  // userId: String,
  
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
});

module.exports = mongoose.model('Review', reviewSchema);
