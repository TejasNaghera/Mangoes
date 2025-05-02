
//store/createStore.js
import { create } from 'zustand';
import axios from 'axios';
import { persist } from 'zustand/middleware';
import useAuthStore from './authStore';
const baseURL = process.env.NEXT_PUBLIC_API_URL
const useCartStore = create(

  persist(

    (set, get) => ({

      cart: [],
      
      

      fetchCart: async () => {
        try {
          const storedAuth = JSON.parse(localStorage.getItem('auth-storage'))?.state;
          const token = storedAuth?.token;

          if (!token) return;

          const res = await axios.get(`${baseURL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const cartItems = (res.data.items || []).map(item => ({
            ...item,
            product: {
              ...item.product,
              image: item.product?.image || '/uploads/kesar-mango.png',
            }
          }));
          
          set({ cart: cartItems });

       


          set({ cart: cartItems });
        } catch (err) {
          console.error('Fetch Cart Error:', err);
        }
      },

    

      
      addToCart: async (product) => {
        try {
          const storedAuth = JSON.parse(localStorage.getItem('auth-storage'))?.state;
          const token = storedAuth?.token;

          if (!token) return;

          await axios.post(
            `${baseURL}/api/cart/add`,
            {
              productId: product._id,
              quantity: 1,
              image: product.image,
              name: product.name,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Refresh cart after adding
          get().fetchCart();
        } catch (err) {
          console.error('Add to Cart Error:', err);
        }
      },


     
      
      removeFromCart: async (productId) => {
        try {
          const storedAuth = JSON.parse(localStorage.getItem('auth-storage'))?.state;
          const token = storedAuth?.token;

          if (!token) return;

          await axios.delete(`${baseURL}/api/cart/remove/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Refresh cart after removing
          get().fetchCart();
        } catch (err) {
          console.error('Remove from Cart Error:', err);
        }
      },

      clearCart: async () => {
        try {
          const storedAuth = JSON.parse(localStorage.getItem('auth-storage'))?.state;
          const token = storedAuth?.token;

          if (!token) return;

          await axios.delete(`${baseURL}/api/cart/clear`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ cart: [] });
        } catch (err) {
          console.error('Clear Cart Error:', err);
        }
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
