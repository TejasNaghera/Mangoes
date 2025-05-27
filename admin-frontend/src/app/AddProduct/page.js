"use client";
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaRegCopy } from "react-icons/fa";
import useProductStore from "../../../store/productStore";
import useAuthStore from "../../../store/authStore"; // if token is stored here
//tebal///delit
import useProductlist from '../../../store/ListProductstore'; // adjust path if needed

export default function InputForm() {
  const initialFormData = {
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    image: null,
    availableStock: "",
    previewURL: null,
    onSale: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const { addProduct, isLoading, error, success } = useProductStore();
  const token = useAuthStore((state) => state.token);
  // Clean up image preview URLs to prevent memory leaks


  ///tabal

  const { products, fetchProducts, deleteProduct, updateProduct } = useProductlist();


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (formData.previewURL) URL.revokeObjectURL(formData.previewURL);
      if (editData?.previewURL) URL.revokeObjectURL(editData.previewURL);
    };
  }, [formData.previewURL, editData?.previewURL]);

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = "Product name is required";
    if (!data.description?.trim()) newErrors.description = "Description is required";
    if (!data.price || data.price <= 0) newErrors.price = "Valid price is required";
    if (!data.availableStock || data.availableStock < 0)
      newErrors.availableStock = "Valid stock quantity is required";
    if (data.offerPrice && data.offerPrice >= data.price)
      newErrors.offerPrice = "Offer price must be less than regular price";
    return newErrors;
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewURL: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate fields like before...
    // if errors → return

    try {
      await addProduct(formData, token);
      alert("Product added successfully!");
      setShowForm(false);
    } catch (err) {
      alert("Failed to add product: " + err.message);
    }
  };
  const handleEditClick = (product) => {
    setEditData({ ...product, previewURL: product.image });
    setShowEditForm(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteData(product);
    setShowDeletePopup(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(editData);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", editData.name);
      formDataToSend.append("description", editData.description || "");
      formDataToSend.append("price", editData.price);
      formDataToSend.append("offerPrice", editData.offerPrice || "");
      if (editData.image instanceof File) {
        formDataToSend.append("image", editData.image);
      }
      formDataToSend.append("availableStock", editData.availableStock);
      formDataToSend.append("onSale", editData.onSale);

      // Zustand store call
      await updateProduct(editData._id, formDataToSend);

      setShowEditForm(false);
      setEditData(null);
      setEditErrors({});
    } catch (error) {
      setEditErrors({ api: error.message || "Failed to update product. Please try again." });
    }
  };

  // Delete 
  const handleDeleteConfirm = async () => {
    await deleteProduct(deleteData._id);
    setShowDeletePopup(false);
    setDeleteData(null);
  };

  if (isLoading) return <p>Loading...</p>;



  return (
    <>
      <h1 className=" text-center text-3xl bg-amber-600  p-6">Add Product</h1>

      <div className="text-end mx-5 my-4">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>

      {/* Error Message for API */}
      {errors.api && (
        <div className="mx-5 text-red-600 text-center">{errors.api}</div>
      )}

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200 shadow-md rounded-lg">
          <thead className="bg-amber-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Product ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price (₹)</th>
              <th className="px-4 py-2 text-left">Offer Price (₹)</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">On Sale</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-amber-500 text-orange-800">
                <td className="px-4 py-7 flex items-center gap-2 text-center">
                  {product._id}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(product._id);
                      toast.success("Product ID copied to clipboard!");
                    }}
                    className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer "
                    title="Copy ID"
                  >
                    <FaRegCopy />
                  </button>
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">₹{product.price}</td>
                <td className="px-4 py-2">
                  {product.offerPrice ? `₹${product.offerPrice}` : '-'}
                </td>
                <td className="px-4 py-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                    alt={product.name}
                    className="h-16 w-16 object-contain rounded"
                  />
                </td>
                <td className="px-4 py-2">{product.availableStock}</td>
                <td className="px-4 py-2">
                  {product.onSale ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </td>
                <td className="px-4 py-1 gap-2 cursor-pointer">
                  {/* ///Edit button */}
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-blue-600 hover:text-blue-800 px-5 text-2xl"
                    disabled={isLoading}
                  >
                    <FaEdit />
                  </button>
                  {/* delete button */}
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="text-red-600 hover:text-red-800 ml-2 text-2xl"
                    disabled={isLoading}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-2xl w-full bg-white p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[100vh]">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              aria-label="Close form"
            >
              ×
            </button>
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-center text-amber-600 mb-6 sm:text-3xl">
                Add Mango Product
              </h2>
              {/* Product Name */}
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter mango name"
                  className={`w-full p-2 border rounded-lg focus:ring-2 text-gray-900 focus:ring-amber-400 focus:outline-none transition-colors ${errors.name ? "border-red-500" : "border-amber-300"
                    }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-600 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>
              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter mango description"
                  rows="2"
                  className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors ${errors.description ? "border-red-500" : "border-amber-300"
                    }`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="text-red-600 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              {/* Price and Offer Price */}
              <div className="grid grid-cols-1 gap-4 mb-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Regular price"
                    min="0"
                    step="0.01"
                    className={`w-full p-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors ${errors.price ? "border-red-500" : "border-amber-300"
                      }`}
                    aria-invalid={!!errors.price}
                    aria-describedby={errors.price ? "price-error" : undefined}
                  />
                  {errors.price && (
                    <p id="price-error" className="text-red-600 text-xs mt-1">
                      {errors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price (₹)
                  </label>
                  <input
                    type="number"
                    id="offerPrice"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleChange}
                    placeholder="Discounted price"
                    min="0"
                    step="0.01"
                    className={`w-full p-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors ${errors.offerPrice ? "border-red-500" : "border-amber-300"
                      }`}
                    aria-invalid={!!errors.offerPrice}
                    aria-describedby={errors.offerPrice ? "offerPrice-error" : undefined}
                  />
                  {errors.offerPrice && (
                    <p id="offerPrice-error" className="text-red-600 text-xs mt-1">
                      {errors.offerPrice}
                    </p>
                  )}
                </div>
              </div>
              {/* Image Upload */}
              <div className="mb-5">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full p-2 border rounded-lg bg-white text-gray-400 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors ${errors.image ? "border-red-500" : "border-amber-300"
                    }`}
                  aria-invalid={!!errors.image}
                  aria-describedby={errors.image ? "image-error" : undefined}
                />
                {errors.image && (
                  <p id="image-error" className="text-red-600 text-xs mt-1">
                    {errors.image}
                  </p>
                )}
                {formData.previewURL && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img
                      src={formData.previewURL}
                      alt="Product preview"
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
              {/* Available Stock & On Sale Toggle */}
              <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="flex-1">
                  <label htmlFor="availableStock" className="block text-sm font-medium text-gray-700 mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    id="availableStock"
                    name="availableStock"
                    value={formData.availableStock}
                    onChange={handleChange}
                    placeholder="Available stock quantity"
                    min="0"
                    className={`w-full p-2 border text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors ${errors.availableStock ? "border-red-500" : "border-amber-300"
                      }`}
                    aria-invalid={!!errors.availableStock}
                    aria-describedby={errors.availableStock ? "availableStock-error" : undefined}
                  />
                  {errors.availableStock && (
                    <p id="availableStock-error" className="text-red-600 text-xs mt-1">
                      {errors.availableStock}
                    </p>
                  )}
                </div>
                <div className="flex items-center mt-4 sm:mt-6">
                  <input
                    type="checkbox"
                    id="onSale"
                    name="onSale"
                    checked={formData.onSale}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-400"
                  />
                  <label htmlFor="onSale" className="ml-2 text-sm font-medium text-gray-700">
                    On Sale
                  </label>
                </div>
              </div>
              <div className="text-center mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isLoading ? "Submitting..." : "Submit Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Form */}
      {showEditForm && editData && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-xl w-full bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              aria-label="Close edit form"
            >
              ×
            </button>
            <form onSubmit={handleEditSubmit}>
              <h2 className="text-2xl font-bold text-center text-amber-600 mb-6 ">
                Edit Mango Product
              </h2>
              {editErrors.api && (
                <div className="text-red-600 text-center mb-4">{editErrors.api}</div>
              )}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className={`w-full p-2 border rounded-lg focus:ring-2 text-black focus:ring-amber-400 focus:outline-none transition-colors ${editErrors.name ? "border-red-500" : "border-amber-300"
                    }`}
                />
                {editErrors.name && (
                  <p className="text-red-600 text-xs mt-1">{editErrors.name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                    className={`w-full p-2 border rounded-lg focus:ring-2 text-black focus:ring-amber-400 focus:outline-none transition-colors ${editErrors.price ? "border-red-500" : "border-amber-300"
                      }`}
                    min="0"
                    step="0.01"
                  />
                  {editErrors.price && (
                    <p className="text-red-600 text-xs mt-1">{editErrors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editData.offerPrice}
                    onChange={(e) => setEditData({ ...editData, offerPrice: parseFloat(e.target.value) })}
                    className={`w-full p-2 border rounded-lg focus:ring-2 text-black focus:ring-amber-400 focus:outline-none transition-colors ${editErrors.offerPrice ? "border-red-500" : "border-amber-300"
                      }`}
                    min="0"
                    step="0.01"
                  />
                  {editErrors.offerPrice && (
                    <p className="text-red-600 text-xs mt-1">{editErrors.offerPrice}</p>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        setEditErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
                        return;
                      }
                      setEditData((prev) => ({
                        ...prev,
                        image: file,
                        previewURL: URL.createObjectURL(file),
                      }));
                      setEditErrors((prev) => ({ ...prev, image: "" }));
                    }
                  }}
                  className={`w-full p-2 border rounded-lg bg-white text-gray-400 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors ${editErrors.image ? "border-red-500" : "border-amber-300"
                    }`}
                />
                {editErrors.image && (
                  <p className="text-red-600 text-xs mt-1 ">{editErrors.image}</p>
                )}
                {editData.previewURL && (
                  <div className="mt-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${editData.image}`}

                      alt="Product preview"
                      className="w-full max-h-32 object-contain rounded text-black"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Stock
                </label>
                <input
                  type="number"
                  value={editData.availableStock}
                  onChange={(e) => setEditData({ ...editData, availableStock: parseInt(e.target.value) })}
                  className={`w-full p-2 border rounded-lg focus:ring-2 text-black focus:ring-amber-400 focus:outline-none transition-colors ${editErrors.availableStock ? "border-red-500" : "border-amber-300"
                    }`}
                  min="0"
                />
                {editErrors.availableStock && (
                  <p className="text-red-600 text-xs mt-1">{editErrors.availableStock}</p>
                )}
              </div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={editData.onSale}
                  onChange={(e) => setEditData({ ...editData, onSale: e.target.checked })}
                  id="onSaleEdit"
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded  focus:ring-amber-400"
                />
                <label htmlFor="onSaleEdit" className="ml-2 text-sm font-medium text-gray-700">
                  On Sale
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Are you sure you want to delete this product?
            </h2>
            <p className="text-gray-700 mb-4">Product Name: {deleteData?.name}</p>
            {errors?.api && <p className="text-red-500 mb-2">{errors.api}</p>}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}