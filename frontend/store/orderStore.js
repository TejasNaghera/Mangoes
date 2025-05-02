import { create } from 'zustand'
import axios from 'axios'

export const useOrderStore = create((set, get) => ({
  address: {
    country: '',
    state: '',
    pinCode: '',
    village: '',
    roomNumber: ''
  },
  setAddress: (newAddress) => set({ address: { ...get().address, ...newAddress } }),

  orderError: null,
  setOrderError: (error) => set({ orderError: error }),

  handlePlaceOrder: async (user, cartItems, clearCart, onSuccess) => {
    const { address } = get()

    // Check empty fields
    if (
      !address.country ||
      !address.state ||
      !address.pinCode ||
      !address.village ||
      !address.roomNumber
    ) {
      set({ orderError: 'Please fill in all address fields.' })
      return
    }

    try {
      const orderData = {
        userId: user._id,
        userName: user.name,
        address: address,
        items: cartItems,
        totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      }

      const res = await axios.post('/api/orders', orderData)

      if (res.data.success) {
        clearCart()
        set({ orderError: null })
        onSuccess?.()  // callback to close modal or notify
      }
    } catch (error) {
      console.error(error)
      set({ orderError: 'Something went wrong while placing the order.' })
    }
  },
}))
