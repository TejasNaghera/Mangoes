// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Set axios auth header when token changes
      setAuthToken: (token) => {
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete api.defaults.headers.common['Authorization'];
        }
      },
      
      // Login action
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          
          // Set token in axios headers
          get().setAuthToken(token);
          
          set({ 
            token, 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false, 
            isAuthenticated: false 
          });
          throw new Error(errorMessage);
        }
      },
      
      // Register action
      register: async (name, email, password, number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', { name, email, password, number});
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      // Logout action
      logout: () => {
        // Clear auth header
        get().setAuthToken(null);
        
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false 
        });
      },
      
      // Get user profile
      getUserProfile: async () => {
        if (!get().token) return null;
        
        set({ isLoading: true });
        try {
          const response = await api.get('/user/profile');
          set({ user: response.data, isLoading: false });
          return response.data;
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          set({ isLoading: false });
          // If unauthorized, logout user
          if (error.response?.status === 401) {
            get().logout();
          }
          return null;
        }
      },
      
      // Clear errors
      clearErrors: () => set({ error: null }),
    }),

    //////is repals............
    {
      name: 'auth-storage', // name of the item in storage
      getStorage: () => typeof window !== 'undefined' ? localStorage : null, // use localStorage
    }
    
    /////////mane..............
    // {
    //   name: 'auth-storage',
    //   getStorage: () => (typeof window !== 'undefined' ? localStorage : null),
    //   partialize: (state) => ({
    //     token: state.token,
    //     isAuthenticated: state.isAuthenticated,
    //     // user field persist નહિ થાય
    //   }),
    // }
  )
);

// Initialize auth token from storage
if (typeof window !== 'undefined') {
  const storedState = JSON.parse(localStorage.getItem('auth-storag'));
  if (storedState?.state?.token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${storedState.state.token}`;
  }
}
