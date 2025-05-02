'use client'
import { useState, useEffect } from "react";
import useProductStore from '../../../store/productStore';
// import ProductCard from '../../components/ProductCard';  // Ensure you import the ProductCard
import ProductCard from '../../../components/ProductCard';  // Ensure you import the ProductCard

export default function Home() {
  const { products, fetchProducts, loading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Check if products are loaded
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  // If no products or undefined, handle gracefully
  if (!products || products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Our Mangoes</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((mango) => {
          // Check if mango object is valid
          if (!mango || !mango.image) {
            return <p key="error">Missing image data for product</p>;
          }

          return (
            <ProductCard
              key={mango._id}
              product={mango}
            />
          );
        })}
      </div>
    </div>
  );
}

