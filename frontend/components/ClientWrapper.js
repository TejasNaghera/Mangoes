'use client';

import { useEffect } from 'react';
import useCartStore from '../store/cartStore';
// import useAuthStore from '../store/authStore';

import { useAuthStore } from '../store/authStore'; 
export default function ClientWrapper({ children }) {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      useCartStore.getState().fetchCart(); // Fetch cart on login
    }
  }, [token]);

  return <>{children}</>;
}
