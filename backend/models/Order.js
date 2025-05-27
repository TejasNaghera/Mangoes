const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  address: String,
  deliveryDate: Date,
  createdAt: Date, 
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      
      name:String,
      quantity: Number,
      image: String,
      price: Number,
    },
    
  ],
  availableStock: {
    type: Number,
    required: true,
    default: 0
  },
  paymentMethod:{
    type:String,
    required: true,
    
  },
  totalAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
