import { create } from 'zustand';
import axios from 'axios';

const useProductlist = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      set({ products: res.data });
     
      
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/delete/${id}`);
      await get().fetchProducts();
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/products/update/${id}`, updatedData);
      await get().fetchProducts(); // update પછી નવી યાદી લાવવી
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useProductlist;
