// routes/Admin/allgetodera.js
const express = require('express');
const router = express.Router();
const { getOrders, getMonthlyPaymentSummary } = require('../../controllers/Admin/alloderadmin');

// ઓર્ડર્સ મેળવવા માટે GET રીક્વેસ્ટ
router.get('/orders', getOrders);
router.get('/orders/payment-summary', getMonthlyPaymentSummary);

module.exports = router;

