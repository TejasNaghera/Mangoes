import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      set({ products: res.data, loading: false });
    } catch (err) {
      console.error('Error fetching products:', err);
      set({ error: 'Failed to fetch products', loading: false });
    }
  },
}));

export default useProductStore;


