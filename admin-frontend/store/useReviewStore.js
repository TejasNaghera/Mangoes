import { create } from 'zustand';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const useReviewStore = create((set) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/api/reviews`);
      set({ reviews: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Failed to fetch reviews',
        loading: false,
      });
    }
  },
///edidt
  updateReview: async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/api/reviews/upadet/${id}`, updatedData);
      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === id ? res.data.review : review
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },


///delet
  deleteReview: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/reviews/delete/${id}`);
      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

}));

export default useReviewStore;
