'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import '../OrderCard.css';
import useReviewStore from '../../../store/reviewStore';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function OrdersPage() {
  const { user, token, getUserProfile, hasHydrated } = useAuthStore();
  const { showModal, rating, reviewText, reviews, error: reviewError, loading, setShowModal, setRating, setReviewText, submitReview, fetchReviews } = useReviewStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && (user._id || user.id)) {
        const userId = user._id || user.id;
        try {
          const res = await api.get(`/api/orders/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(res.data.orders);
          // Fetch reviews for each order
          for (const order of res.data.orders) {
            await fetchReviews(order._id, token); // Pass token
          }
        } catch (err) {
          // setError('Failed to fetch orders');
        }
      } else if (token) {
        getUserProfile();
      }
    };

    fetchOrders();
  }, [user, token, getUserProfile, fetchReviews]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    
    return `${day}/${month}/${year}`;
  };
  // console.log(formatDate);
  

  const getProgressPercent = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now <= start) return 0;
    if (now >= end) return 100;

    const total = end - start;
    const current = now - start;
    return Math.floor((current / total) * 100);
  };

  const openReviewModal = (orderId) => {
    setShowModal(true, orderId);
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-green-900">📦 My Orders</h1>
      {error && <p className="text-red-600">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          const deliveryDate = new Date(order.createdAt);
          deliveryDate.setDate(deliveryDate.getDate() + 5);
          const progressPercent = getProgressPercent(order.createdAt, deliveryDate);

          return (
            <div className="order-card" key={order._id}>
              <div className="status-ribbon"></div>
              <div className="order-header">
                <h3 className="order-id">Order #{order._id.slice(-6)}</h3>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="product-container">
                <div className="product-image-container">
                  <img
                    src={`${API_URL}${order.items[0]?.image}` || '/default-product.png'}
                    alt={order.items[0]?.name}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <h2 className="product-name">{order.items[0].name}</h2>
                  <div className="product-details">
                    <p className="detail-item">
                      <span className="label">Price:</span> ₹{order.items[0]?.price}
                    </p>
                    <p className="detail-item">
                      <span className="label">Qty:</span> {order.items.length}
                    </p>
                    <p className="detail-item">
                      <span className="label">Total:</span> ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="delivery-info">
                <div className="info-group">
                  <p className="info-label">Expected Delivery</p>
                  <p className="info-value">{formatDate(deliveryDate)}</p>
                </div>
                <div className="info-group">
                  <p className="info-label">Delivery Address</p>
                  <p className="info-value">
                    {order.address ? order.address.substr(0, 20) + '...' : 'Standard Delivery'}
                  </p>
                </div>
                <div className="info-group">
                  <p className="info-label">Payment Method</p>
                  <p className="info-value">{order.paymentMethod || 'Online Payment'}</p>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-labels">
                  <span className="progress-label">Order Placed</span>
                  <span className="progress-label">Expected Delivery</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-background">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="progress-dates">
                    <div>{formatDate(order.createdAt)}</div>
                    <div>{formatDate(deliveryDate)}</div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                {progressPercent === 100 && (
                  <button className="btn btn-secondary" onClick={() => openReviewModal(order._id)}>
                    Write Review
                  </button>
                )}
                <div className="mt-4">
                  {/* <h4 className="text-sm font-semibold">Reviews</h4> */}
                  {reviews
                    .filter((review) => review.orderId === order._id)
                    .map((review, index) => (
                      <div key={index} className="border-t py-2 text-sm">
                        <p>
                          <strong>{review.userName}</strong>: {'🌟'.repeat(review.rating)}
                        </p>
                        <p>{review.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        })
      )}

      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-black">Write a Review</h2>
      <p className="mb-2 text-sm text-gray-600">User: <strong>{user?.name}</strong></p>

      <label className="block mb-2 font-medium text-black">Rating:</label>
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-2xl mr-1 transition-transform duration-200 ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            } hover:text-yellow-600 hover:scale-125`}
            onClick={() => setRating(star)}
            disabled={loading}
          >
            {star <= rating ? '🌟' : '⭐'}
          </button>
        ))}
      </div>

      <label className="block mb-2 font-medium text-black">Review Description:</label>
      <textarea
        className="w-full border border-gray-300 rounded p-2 mb-4 text-black"
        rows="3"
        value={reviewText || ''} // Fallback to empty string
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your feedback here..."
        disabled={loading}
      ></textarea>

      {reviewError && <p className="text-red-500 text-sm mb-4">{reviewError}</p>}
      {loading && <p className="text-blue-500 text-sm mb-4">Submitting...</p>}

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setShowModal(false)}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => submitReview(user, token)}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}