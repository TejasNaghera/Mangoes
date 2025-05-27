'use client';
import { useEffect, useState } from 'react';
import useReviewStore from '../../../store/useReviewStore';
import { FiEdit, FiTrash } from 'react-icons/fi';

export default function ReviewsPage() {
  const {
    reviews,
    fetchReviews,
    updateReview,
    deleteReview,
    loading,
    error,
  } = useReviewStore();

  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState({
    userName: '',
    rating: '',
    description: '',
    status: false,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setForm({
      userName: review.userName,
      rating: review.rating,
      description: review.description,
      status: review.status,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    await updateReview(selectedReview._id, form);
    setEditModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    await deleteReview(selectedReview._id);
    setDeleteModalOpen(false);
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-0 py-5 px-1  bg-orange-400"> Kesar Mango Reviews</h1>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full   shadow-md rounded-lg">
          <thead className="bg-orange-400">
            <tr>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Rating</th>
              <th className="py-2 px-4 border max-w-xs truncate">Review</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b py-5 text-center hover:bg-orange-100">
                <td className="py-5 px-4  text-orange-800">{review.userName}</td>
                <td className="py-5 px-4  text-orange-800">{review.rating} ⭐</td>
                <td className="h-8 py-5 px-4 text-orange-800 max-w-xs ">{review.description}</td>
                <td className="py-5 px-4  text-orange-800">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${review.status ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                  >
                    {review.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-2 px-4  space-x-2 flex items-center mt-7 text-orange-800">
                  <button
                    onClick={() => handleEditClick(review)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(review)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FiTrash size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className=" fixed inset-0  bg-opacity-40 flex items-center justify-center">
          <div className="bg-orange-400 p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Edit Review</h2>
            <input
              type="text"
              className="w-full mb-2 border p-2"
              placeholder="Username"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
            <input
              type="number"
              className="w-full mb-2 border p-2"
              placeholder="Rating"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />
            <textarea
              className="w-full mb-2 border p-2"
              placeholder="Description"
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.checked })}
              />
              <span>Active</span>
            </label>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center">
          <div className="bg-orange-400 p-6 rounded-lg w-[300px] text-center">
            <p className="mb-4">Are you sure you want to delete this review?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
