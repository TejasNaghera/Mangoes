'use client';
import useCartStore from '../store/cartStore';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_API_URL
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
<div className="p-3 sm:p-4 w-full border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
  <div className="relative pb-[60%] sm:pb-[70%] md:pb-[60%] overflow-hidden rounded-lg mb-3">
    <img
      src={`${baseURL}${product.image}`}
      alt={product.name}
      className="absolute top-0 left-0 w-full h-full object-cover border-b border-gray-200"
    />

    {/* On Sale Badge */}
    {product.onSale && (
      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded shadow-md z-10">
        On Sale
      </div>
    )}
  </div>

  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 line-clamp-1">{product.name}</h2>
  <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 line-clamp-2 h-10 sm:h-12">{product.description}</p>

  <div className="flex flex-wrap items-center justify-between mt-2 sm:mt-4">
    <div className="text-lg sm:text-xl font-semibold text-green-600">
      ₹{product.offerPrice}
    </div>

    <div className="text-lg sm:text-lg font-semibold">
      {product.availableStock === 0 ? (
        <span className="text-red-600">comig soon</span>
      ) : product.availableStock < 6 ? (
        <span className="text-yellow-500">Limited Box</span>
      ) : (
        <span className="text-green-600"></span>
      )}
    </div>

    <div className="text-xs sm:text-sm text-gray-400 line-through">₹{product.price}</div>
  </div>

  <button
    onClick={handleAddToCart}
    disabled={isAdding || loading}
    className={`mt-3 sm:mt-4 w-full py-1 sm:py-2 text-white rounded-lg transition-colors duration-300 text-sm sm:text-base ${isAdding || loading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-yellow-500 hover:bg-yellow-600'
      }`}
  >
    {isAdding || loading ? 'Adding...' : 'Add to Cart'}
  </button>
</div>

  );
};

export default ProductCard;



