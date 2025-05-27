const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// API endpoints
router.post('/', reviewController.createReview);
router.get('/', reviewController.getReviews);
router.put('/upadet/:id', reviewController.updateReview);
router.delete('/delete/:id', reviewController.deleteReview)
router.get('/approved',reviewController.getApprovedReviews);

module.exports = router;