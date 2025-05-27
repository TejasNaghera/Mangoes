import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      loading: true,
      totalPages: 1,
      totalOrders: 0,
      currentPage: 1,
      itemNames: [],
      selectedItemName: '',
      error: '',

      setSelectedItemName: (name) => set({ selectedItemName: name }),

      fetchOrders: async (page = 1, nameFilter = '') => {
        const token = localStorage.getItem('authToken');
        try {
          const res = await fetch(
            `${API_URL}/api/admin/orders?page=${page}&limit=10&name=${encodeURIComponent(nameFilter)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json();
          const names = new Set();
          (data.orders || []).forEach((order) => {
            order.items.forEach((item) => names.add(item.name));
          });

          set({
            orders: data.orders || [],
            currentPage: data.currentPage || 1,
            totalPages: data.totalPages || 1,
            itemNames: Array.from(names),
            loading: false,
            error: '',
          });
        } catch (error) {
          console.error('Error fetching orders:', error);
          set({ loading: false, error: 'Failed to fetch orders' });
        }
      },

      goToNextPage: () => {
        const { currentPage, totalPages, fetchOrders, selectedItemName } = get();
        if (currentPage < totalPages) {
          fetchOrders(currentPage + 1, selectedItemName);
        }
      },

      goToPrevPage: () => {
        const { currentPage, fetchOrders, selectedItemName } = get();
        if (currentPage > 1) {
          fetchOrders(currentPage - 1, selectedItemName);
        }
      },
    }),
    {
      name: 'order-storage', // Optional
    }
  )
);
