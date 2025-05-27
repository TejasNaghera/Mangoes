const Order = require('../models/Order');
const user = require('../models/User');

const Product = require("../models/Product");


exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address , paymentMethod} = req.body;
    const { _id, name ,image} = req.user;

    // console.log("Request Body:", req.body); //Debug

    // 1️ Check each product stock
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.availableStock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
    }

    // 2️ Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableStock: -item.quantity },
      });
    }

    
    const createdAt = new Date();
    let deliveryDate = new Date(createdAt);
    
    if (address.toLowerCase().includes('gujarat')) {
      deliveryDate.setDate(deliveryDate.getDate() + 3);
    } else {
      deliveryDate.setDate(deliveryDate.getDate() + 6);
    }
    



    // 3️ Save Order
    const newOrder = new Order({
      userId: _id,
      userName: name,
      image,
      address,
      deliveryDate,
      items,
      totalAmount,
      paymentMethod,
    });

    await newOrder.save();

    res.status(201).json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Order placement failed." });
  }
};



exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};


