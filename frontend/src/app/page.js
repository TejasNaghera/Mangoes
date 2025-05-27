'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/navigation';
import useReviewStore from '../../store/reviewStore'; // Adjust path

export default function Home() {
  const { approvedReviews, loading, error, fetchApprovedReviews } = useReviewStore();
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const cardData = [
    {
      icon: faDroplet,
      title: 'Sweet & Juicy',
      description: 'Deliciously sweet with a rich, juicy flavor',
    },
    {
      icon: faLeaf,
      title: 'Aromatic',
      description: 'Fragrant aroma that is truly irresistible',
    },
    {
      icon: farHeart,
      title: 'Nutrient-Rich',
      description: 'Packed with essential vitamins and minerals',
    },
  ];

  // Fetch reviews on mount
  useEffect(() => {
    fetchApprovedReviews();
  }, [fetchApprovedReviews]);

  // Auto-rotate reviews
  useEffect(() => {
    if (!approvedReviews || approvedReviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % approvedReviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [approvedReviews]);

  // Manual carousel controls
  const handleNext = () => {
    if (approvedReviews && approvedReviews.length > 0) {
      setCurrent((prev) => (prev + 1) % approvedReviews.length);
    }
  };

  const handlePrevious = () => {
    if (approvedReviews && approvedReviews.length > 0) {
      setCurrent((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length);
    }
  };

  const handleShopNow = () => {
    router.push('/products');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 px-4 py-8 md:px-12 lg:px-20 md:py-16">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          <div className="space-y-2 sm:space-y-4 md:space-y-6">
            <h1 className="special-font font-extralight text-green-900 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none">
              Kesar
            </h1>
            <h1 className="special-font font-extralight text-green-900 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none">
              Mangoes
            </h1>
            <p className="text-gray-600 text-base md:text-lg lg:text-xl mt-2 md:mt-4">
              Premium quality mangoes direct from the farm
            </p>
            <div className="pt-2 md:pt-4">
              <button
                className="bg-green-900 text-white text-base md:text-lg px-6 py-2 rounded-full hover:bg-green-800 transition duration-300 shadow-md"
                onClick={handleShopNow}
                aria-label="Shop Kesar Mangoes"
              >
                Shop Now
              </button>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="relative overflow-hidden">
              <Image
                src="/istockphoto-450724125-612x612.jpg"
                alt="Delicious Kesar Mangoes"
                width={612}
                height={612}
                className="w-full h-auto object-cover img1"
                priority
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full mt-12">
          <h2 className="text-4xl text-center text-green-900 font-semibold">
            About Kesar Mangoes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {cardData.map((item, index) => {
              const isCenterCard = (index + 1) % 3 === 2;
              return (
                <div
                  key={index}
                  className={`p-4 text-center relative group border-gray-400 ${
                    isCenterCard ? 'border-l border-r' : ''
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    style={{ height: '49px', width: '49px' }}
                    className="text-green-600 mb-2"
                    aria-hidden="true"
                  />
                  <h5 className="text-2xl text-green-900 font-semibold">{item.title}</h5>
                  <p className="text-green-900">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="bg-yellow-400 w-full px-4 py-8 md:px-12 lg:px-20 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 flex justify-center items-center flex-col">
            <h1 className="text-green-700 sm:text-6xl text-4xl">Best Deals</h1>
            <h3 className="text-white sm:text-8xl text-6xl md:ml-9 lg:ml-25">
              20% off
            </h3>
          </div>
          <div className="w-full max-w-sm mx-auto overflow-hidden">
            <Image
              src="/kesar-mango.png"
              alt="Kesar Mango"
              width={400}
              height={320}
              className="w-full h-80 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-100 pb-6 pt-3">
        <h2 className="text-5xl font-bold mb-4 text-green-900 text-center">
          Customer Reviews
        </h2>
        <div className="max-w-md mx-auto p-6 rounded text-center">
          {loading && <p className="text-gray-600">Loading reviews...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {(!approvedReviews || approvedReviews.length === 0) && !loading && !error && (
            <p className="text-gray-600">No reviews available</p>
          )}
          {approvedReviews && approvedReviews.length > 0 && !loading && !error && (
            <>
              <div
                className="mb-4 transition duration-300 ease-in-out"
                role="region"
                aria-live="polite"
              >
                <h3 className="font-semibold text-black">
                  {approvedReviews[current].
userName}
                </h3>
                <p className="text-yellow-500">
                  {'★'.repeat(approvedReviews[current].rating)}
                </p>
                <p className="text-gray-700">{approvedReviews[current].description
}</p>
              </div>
              
            </>
          )}
        </div>
      </div>
    </>
  );
}