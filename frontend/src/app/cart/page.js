'use client';

import { useState, useEffect } from 'react';
import useCartStore from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCartButtonStore } from '../../../store/cartButtonStore';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CartPage = () => {
  const { cart, removeFromCart, loading, error } = useCartStore();
  const { user, token } = useAuthStore();
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    state: 'Gujarat',
    city: '',
    village: '',
    pinCode: '',
    roomNumber: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to COD
  
  const { clearCart } = useCartStore.getState();
  const { disableCartButton, enableCartButton } = useCartButtonStore();

  const fetchCart = useCartStore(state => state.fetchCart);
  
  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user, fetchCart]);

  useEffect(() => {
    // Update total price whenever the cart changes
    setTotalPrice(cart.reduce((total, item) => total + (item.product?.offerPrice || 0) * item.quantity, 0));
  }, [cart]);

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handlePlaceOrder = async (selectedPaymentMethod) => {
    if (!user?.id) {
      setOrderError("Please login to place an order");
      return;
    }

    // Basic validation for address fields
    if (!address.pinCode) {
      setOrderError("Please enter your pin code");
      return;
    }
    if (!address.city) {
      setOrderError("Please select your city/district");
      return;
    }
    if (!address.village) {
      setOrderError("Please enter your village/society/area");
      return;
    }

    try {
      setOrderProcessing(true);
      setOrderError(null);
      const fullAddress = `${address.state}, ${address.city}, ${address.village}, ${address.pinCode}, ${address.roomNumber || ''}`;

      // Call your backend API to create order
      const response = await axios.post(
        `${API_URL}/api/orders`,
        {
          userId: user._id,
          userName: user.name,
          address: fullAddress,
          items: cart.map(item => ({
            productId: item.product?._id,
            name: item.product?.name,
            image: item.product?.image,
            quantity: item.quantity,
            price: item.product?.offerPrice,
          })),
          totalAmount: totalPrice,
          paymentMethod: selectedPaymentMethod, // Include payment method in order
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      
      // If order successful, clear cart and show success message
      if (response.data.success) {
        toast.success("Order placed successfully! 🎉");
        await clearCart();
        // Optionally clear the cart after successful order
        await fetchCart(); 
        
        // Redirect to products page
        setTimeout(() => {
          window.location.href = `/products`;
        }, 1000); 
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrderProcessing(false);
    }
  };

  // Disable cart button when page opens
  useEffect(() => {
    disableCartButton();
    return () => {
      enableCartButton();
    };
  }, [disableCartButton, enableCartButton]);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Your Cart</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className='text-black font-medium mt-4'>Your cart is empty</p>
          <a href="/products" className="mt-4 inline-block px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center bg-white p-4 rounded shadow">
              <div className="flex items-center">
                <img
                  src={`${API_URL}${item.product?.image}`}
                  alt={item.product?.name || 'Product'}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.src = `/placeholder-image.png`; // Fallback image
                  }}
                />

                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-black">{item.product?.name || 'Product'}</h2>
                  <p className="text-gray-600">₹{item.product?.offerPrice || 0} × {item.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item.product?._id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total Price */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-black">Subtotal:</h2>
              <p className="text-lg text-black">₹{totalPrice}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-lg font-medium text-black">Delivery:</h2>
              <p className="text-lg text-black">₹0</p>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Total:</h2>
              <p className="text-xl font-bold text-black">₹{totalPrice}</p>
            </div>
          </div>

          {/* Error display */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            onClick={() => setShowAddressModal(true)}
            disabled={orderProcessing || cart.length === 0}
            className={`w-full bg-green-900 hover:bg-green-800 text-white px-4 py-3 rounded-md mt-2 font-medium ${(orderProcessing || cart.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {orderProcessing ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Delivery Address</h2>
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">Please enter your complete delivery details</p>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-4">
              {/* Pin Code and City in Two Columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* State - Fixed to Gujarat */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <span>🏞️</span> State
                  </label>
                  <input 
                    type="text"
                    value="Gujarat"
                    readOnly
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 bg-gray-50 outline-none transition-all"
                  />
                </div>

                {/* Pin Code */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <span>📮</span> Pin Code
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter pin code"
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    value={address.pinCode || ''}
                    onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                  />
                </div>
              </div>

              {/* City/District Dropdown - Only Gujarat Cities */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <span>🏙️</span> City/District
                </label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none bg-white"
                  value={address.city || ''}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                >
                  <option value="" disabled>Select city/district</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Jamnagar">Jamnagar</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                  <option value="Junagadh">Junagadh</option>
                  <option value="Anand">Anand</option>
                  <option value="Navsari">Navsari</option>
                  <option value="Morbi">Morbi</option>
                  <option value="Patan">Patan</option>
                  <option value="Bharuch">Bharuch</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Village / Society */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <span>🏘️</span> Village / Society / Area
                </label>
                <input 
                  type="text"
                  placeholder="Enter village, society or area name"
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  value={address.village || ''}
                  onChange={(e) => setAddress({ ...address, village: e.target.value })}
                />
              </div>

              {/* Room Number / House No */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <span>🚪</span> House/Flat No.
                </label>
                <input 
                  type="text"
                  placeholder="Enter house number, flat or room number"
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  value={address.roomNumber || ''}
                  onChange={(e) => setAddress({ ...address, roomNumber: e.target.value })}
                />
              </div>

              {/* Error message display */}
              {orderError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {orderError}
                  </p>
                </div>
              )}
            </div>

            {/* Actions Footer with Payment Selection Checkboxes */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl space-y-4">
              <p className="text-gray-700 font-medium">Select Payment Method:</p>
              
              <div className="flex flex-col gap-3">
                {/* Cash on Delivery Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === 'Cash'}
                    onChange={() => setPaymentMethod('Cash')}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-400"
                  />
                  <span className="flex items-center gap-2 text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cash on Delivery
                  </span>
                </label>
                
                {/* Online Payment Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-400"
                  />
                  <span className="flex items-center gap-2 text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Online Payment
                  </span>
                </label>
              </div>
              
              {/* Confirm Order Button - Only shown when COD is selected */}
              {paymentMethod === 'Cash' && (
                <button 
                  onClick={() => handlePlaceOrder('Cash')}
                  disabled={orderProcessing}
                  className={`w-full px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2 ${orderProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {orderProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm Order
                    </>
                  )}
                </button>
              )}
              
              {/* Proceed to Payment Button - Only shown when Online Payment is selected */}
              {paymentMethod === 'online' && (
                <button 
                  onClick={() => handlePlaceOrder('online')}
                  disabled={orderProcessing}
                  className={`w-full px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center gap-2 ${orderProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {orderProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Proceed to Payment
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;