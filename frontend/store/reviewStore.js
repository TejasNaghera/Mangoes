import { create } from 'zustand';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const useReviewStore = create((set, get) => ({
  showModal: false,
  rating: 1,
  reviewText: '', // Ensure this is defined
  reviews: [],
  selectedOrderId: null,
  error: null,
  loading: false,

  setShowModal: (value, orderId = null) => set({ showModal: value, selectedOrderId: orderId, error: null }),
  setRating: (rating) => set({ rating }),
  setReviewText: (text) => {
    console.log('setReviewText called with:', text); // Debug
    set({ reviewText: text });
  },

  submitReview: async (user, token) => {
    const { rating, reviewText } = get();
    // console.log(selectedOrderId)
    try {
      set({ loading: true, error: null });

      if (!rating || !reviewText) {
        set({ error: 'Please provide a rating and review text', loading: false });
        return;
      }
      if (rating < 1 || rating > 5) {
        set({ error: 'Rating must be between 1 and 5', loading: false });
        return;
      }
      // if (!selectedOrderId || !user?._id) {
      //   set({ error: 'Invalid order or user', loading: false });
      //   return;
      // }
      const status = false; 
      const response = await axios.post(
        `${API_URL}/api/reviews`,
        {
          // orderId: selectedOrderId,
         
          userName: user.name,
          rating,
          status,
          description: reviewText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({
        reviews: [...get().reviews, response.data.review],
        showModal: false,
        rating: 1,
        reviewText: '',
        selectedOrderId: null,
        error: null,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to submit review',
        loading: false,
      });
    }
  },



  fetchApprovedReviews: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/api/reviews/approved`);
      set({ approvedReviews: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch reviews', loading: false });
    }
  },

}));

export default useReviewStore;