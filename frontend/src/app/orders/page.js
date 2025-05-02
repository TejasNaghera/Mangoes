'use client'
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api'; // ← જેથા axios instance છે
import '../OrderCard.css';
export default function OrdersPage() {
  const { user, token, getUserProfile } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && (user._id || user.id)) {
        const userId = user._id || user.id;
        console.log('User ID:', userId);

        try {
          const res = await api.get(`http://localhost:5000/api/order/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,   // 🔥 Add Authorization header here
            },
          });

          console.log('Fetched Orders....:', res.data.orders);
          setOrders(res.data.orders);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError('Orders error');
        }
      } else if (token) {
        getUserProfile();  // If user missing but token exists, fetch profile
      } else {
        router.push('/login');  // If no user/token, redirect to login
      }
    };

    fetchOrders();
  }, [user, token, getUserProfile, router]); // dependencies

  return (
    <div className="p-6  bg-gray-100 ">
      <h1 className="text-2xl font-bold mb-6  text-green-900">📦 My Orders</h1>
      {error && <p className="text-red-600 ">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          // Delivery time calculate કરો => 5 days after order.createdAt
          const deliveryDate = new Date(order.createdAt);
          deliveryDate.setDate(deliveryDate.getDate() + 5);


          function formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based month
            const year = String(date.getFullYear()).slice(0); // last 2 digits

            return `${day}/${month}/${year}`;
          }
          //////progaresh bar

          function getProgressPercent(startDate, endDate) {
            const now = new Date();
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (now <= start) return 0;
            if (now >= end) return 100;

            const total = end - start;
            const current = now - start;
            return Math.floor((current / total) * 100);
          }

          return (
            <div className="order-card" key={order._id}>
            {/* Status Ribbon */}
            <div className="status-ribbon"></div>
            
            {/* Header with Order ID */}
            <div className="order-header">
              <h3 className="order-id">Order #{order._id.slice(-6)}</h3>
              <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
      
            {/* Product Image and Info */}
            <div className="product-container">
              <div className="product-image-container">
                <img
                  src={`http://localhost:5000${order.items[0]?.image}` || '/default-product.png'}
                  alt={order.items[0]?.name}
                  className="product-image"
                />
                {order.items.length > 1 && (
                  <div className="additional-items-badge">
                    +{order.items.length - 1}
                  </div>
                )}
              </div>
      
              <div className="product-info">
                <h2 className="product-name">{order.items[0]?.name}</h2>
                <div className="product-details">
                  <p className="detail-item">
                    <span className="label">Price:</span> ₹{order.items[0]?.price}
                  </p>
                  <p className="detail-item">
                    <span className="label">Qty:</span> {order.items[0]?.quantity}
                  </p>
                  <p className="detail-item">
                    <span className="label">Total:</span> ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            </div>
      
            {/* Delivery Info */}
            <div className="delivery-info">
              <div className="info-group">
                <p className="info-label">Expected Delivery</p>
                <p className="info-value">{formatDate(order.deliveryDate)}</p>
              </div>
                
              <div className="info-group">
                <p className="info-label">Delivery Address</p>
                <p className="info-value">
                  {order.address ? (order.address.substr(0, 20) + "...") : "Standard Delivery"}
                </p>
              </div>
                
              <div className="info-group">
                <p className="info-label">Payment Method</p>
                <p className="info-value">{order.paymentMethod || "Online Payment"}</p>
              </div>
            </div>
      
            {/* Progress Tracker */}
            <div className="progress-container">
              <div className="progress-labels">
                <span className="progress-label">Order Placed</span>
                <span className="progress-label">Expected Delivery</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-background">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${getProgressPercent(order.createdAt, order.deliveryDate)}%` }}
                  ></div>
                </div>
                
                {/* Date Labels */}
                <div className="progress-dates">
                  <div>{formatDate(order.createdAt)}</div>
                  <div>{formatDate(order.deliveryDate)}</div>
                </div>
              </div>
            </div>
      
            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn btn-secondary">Track Order</button>
              <button className="btn btn-primary">View Details</button>
            </div>
          </div> 
          );
        })
      )}
    </div>
  );
}
