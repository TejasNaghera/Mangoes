const Review = require('../models/Review');

// Create a new review
// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { userName, rating, description, status } = req.body;
    // console.log(req.body);

    // Validation
    if (
      userName === undefined || 
      rating === undefined || 
      description === undefined || 
      status === undefined
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = new Review({ userName, rating, description, status });
    await review.save();

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

///edit 
// Update a review by ID
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, description, status } = req.body;
    // console.log(req.body);
    

    // Validation
    if (
      userName === undefined || 
      rating === undefined || 
      description === undefined || 
      status === undefined
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { userName, rating, description, status },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

///delete
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
// Get reviews (optionally filtered by orderId)
exports.getReviews = async (req, res) => {
  try {
    const { orderId } = req.query;
    const query = orderId ? { orderId } : {}; // optional filtering
    const reviews = await Review.find(query);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

//// status:true 


exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: true });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch approved reviews' });
  }
};


