const express = require('express');
const router = express.Router();
const { placeOrder, getOrdersByUser } = require('../controllers/orderController');
const  auth  = require('../middleware/auth');

router.post('/', auth, placeOrder);               // POST for placing order
router.get('/:userId', auth, getOrdersByUser);    // GET to fetch orders by user

module.exports = router;
