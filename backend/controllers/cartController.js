// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    // console.log('📦 Incoming cart data:', req.body);
    const { productId, quantity = 1, image, name, paymentMethod } = req.body;
    
    const parsedQuantity = parseInt(quantity);
    if (!productId || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: 'Invalid productId or quantity' });
    }

    // console.log('👤 Authenticated user ID:', req.userId);

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if item exists
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += parsedQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: parsedQuantity,
        image,       // Optional
        name,        // Optional
        paymentMethod // Optional
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (err) {
    console.error('❌ Error adding to cart:', err);
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