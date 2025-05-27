import { create } from 'zustand';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const useProductStore = create((set) => ({
  isLoading: false,
  error: null,
  success: false,

  addProduct: async (formData, token) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("offerPrice", formData.offerPrice);
      payload.append("availableStock", formData.availableStock);
      payload.append("onSale", formData.onSale);
      payload.append("image", formData.image); // File

      const response = await axios.post(
        `${API_URL}/api/products/add`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Optional if protected route
          },
        }
      );

      set({ isLoading: false, success: true });
      return response.data;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || err.message });
      throw err;
    }
  },
}));
export default useProductStore;
