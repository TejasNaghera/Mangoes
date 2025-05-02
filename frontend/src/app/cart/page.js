'use client';

import { useState, useEffect } from 'react';
import useCartStore from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { useCartButtonStore } from '../store/cartButtonStore';
import { useCartButtonStore } from '../../../store/cartButtonStore';
const CartPage = () => {
  const { cart, removeFromCart, loading, error } = useCartStore();
  const { user, token } = useAuthStore();
  // console.log("User from store:", user.id);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState('');
  const { clearCart } = useCartStore.getState();
  const { disableCartButton, enableCartButton } = useCartButtonStore();

  const fetchCart = useCartStore(state => state.fetchCart);
  ////gat api call
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

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      setOrderError("Please login to place an order");
      return;
    }

    try {
      setOrderProcessing(true);
      setOrderError(null);
      const fullAddress = `${address.state || ''},${address.country || ''},${address.roomNumber || ''}, ${address.village || ''}, ${address.pinCode || ''},`;

      // Call your backend API to create order
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        {
          userId: user._id,
          userName: user.name,
          address: fullAddress || "Default Address", // fallback
          items: cart.map(item => ({
            productId: item.product?._id,
            name: item.product?.name,
            image: item.product?.image,//yah se img ja rahi he
            quantity: item.quantity,
            price: item.product?.offerPrice,
          })),
          totalAmount: totalPrice,
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
        
        // rdayrect
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

//Page open disable butann
  useEffect(() => {
    disableCartButton(); // Page open होते ही disable

    return () => {
      enableCartButton(); // Page से बाहर जाते ही enable
    };
  }, [disableCartButton, enableCartButton]);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Your Cart</h1>

      {cart.length === 0 ? (
        <p className='text-black'>No items in cart.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center bg-white p-4 rounded shadow">
              <div className="flex items-center">
                <img
                  src={`http://localhost:5000${item.product?.image}`}
                  alt={item.product?.name || 'Product'}
                  className="w-20 h-20 object-cover rounded"
                  // onError={(e) => {
                  //   e.target.src = `/kesar-mango.png`;
                  // }}
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

          {/* 👉 Total Price */}
          <div className="mt-6 text-right">
            <h2 className="text-xl font-bold text-black">Total: ₹{totalPrice}</h2>
          </div>

          {/* Order Error */}
          {/* {orderError && <p className="text-red-500 mt-2">{orderError}</p>} */}

          <button
            onClick={() => setShowAddressModal(true)}
            disabled={orderProcessing}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            {orderProcessing ? "Processing..." : "Order Now"}
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
        {/* Country Dropdown */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <span>🏡</span> Country
          </label>
          <select
            className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none bg-white"
            value={address.country || ''}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            <option value="" disabled>Select your country</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
            <option value="Other">Other</option>
          </select>

          
        </div>

        {/* Two columns for State and Pin Code */}
        <div className="grid grid-cols-2 gap-4">
          {/* State Dropdown */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <span>🏞️</span> State
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none bg-white"
              value={address.state || ''}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              <option value="" disabled>Select state</option>
              {/* Indian States */}
              {address.country === 'India' && (
                <>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>  
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                </>
              )}
              
              {/* US States - will show if country is US */}
              {address.country === 'United States' && (
                <>
                  <option value="Alabama">Alabama</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Arizona">Arizona</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Florida">Florida</option>
                  <option value="New York">New York</option>
                  <option value="Texas">Texas</option>
                  {/* Add more US states as needed */}
                </>
              )}
              
              {/* For other countries or if no country is selected */}
              {(!address.country || (address.country !== 'India' && address.country !== 'United States')) && (
                <option value="Other">Please specify in address</option>
              )}
            </select>
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

        {/* City/District Dropdown */}
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
            
            {/* Dynamic options based on state selection - example for Maharashtra */}
            {address.state === 'Maharashtra' && (
              <>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Thane">Thane</option>
                <option value="Nashik">Nashik</option>
                <option value="Aurangabad">Aurangabad</option>
                <option value="Other">Other</option>
              </>
            )}
            
            {/* Gujarat cities */}
            {address.state === 'Gujarat' && (
              <>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Other">Other</option>
              </>
            )}
            
            {/* For other states or if no state is selected */}
            {(!address.state || (address.state !== 'Maharashtra' && address.state !== 'Gujarat')) && (
              <option value="Other">Please specify in address</option>
            )}
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

      {/* Actions Footer */}
      <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
        <button 
          onClick={() => setShowAddressModal(false)}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Cancel
        </button>
        <button 
          onClick={handlePlaceOrder}
          className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Confirm Order
        </button>
      </div>
    </div>
  </div>
)}
</div>

    
  );
};

export default CartPage;
