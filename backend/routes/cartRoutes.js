// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');


// Apply auth middleware to all cart routes
router.use(auth);

// Cart routes
router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;