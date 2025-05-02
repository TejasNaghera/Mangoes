// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    console.log('📦 Incoming cart data:', req.body);
    const { productId, quantity = 1, image,name } = req.body;  // Get image from request body
    
    console.log('👤 Authenticated user ID:', req.userId);

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      // Create new cart if user doesn't have one
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item to cart with image
      cart.items.push({ product: productId, quantity, image,name});
    }

    await cart.save();
    
    // Populate product details for response
    await cart.populate('items.product');
    
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    
    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }
    
    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      const price = item.product.onSale ? item.product.offerPrice : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
    
    res.status(200).json({ 
      items: cart.items,
      total: total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
    
    // Find user's cart
    const cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    // Populate product details
    await cart.populate('items.product');
    
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find user's cart
    const cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    
    // Populate product details
    await cart.populate('items.product');
    
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Clear all items
    cart.items = [];
    await cart.save();
    
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};