import { create } from 'zustand';

export const useCartButtonStore = create((set) => ({
  isCartButtonDisabled: false,
  disableCartButton: () => set({ isCartButtonDisabled: true }),
  enableCartButton: () => set({ isCartButtonDisabled: false }),
}));
