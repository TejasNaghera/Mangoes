'use client'

import React from "react";
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
// import useCartStore from '@/store/cartStore';
import useCartStore from '../../store/cartStore';
import { useRouter } from 'next/navigation';


const staticReviews = [
  { id: 1, name: "Amit", review: "Ye mangoes ekdum fresh aur juicy the! Taste bilkul natural aur meetha tha.Delivery bhi time par hui, definitely dobara order karunga!", rating: 5 },
  { id: 2, name: "Neha", review: "Bahut hi acchi quality ke aam mile. Size bada tha aur khushbu bhi kamaal ki thi!Pure desi swaad mila, family ne bhi kaafi enjoy kiya", rating: 4 },
  { id: 3, name: "Raj", review: "Mangoes itne meethe aur rasbhare the ke ek baar mein pura dabba khatam kar diya! Packing bhi badiya thi, aam bilkul damage nahi hue.", rating: 3 },
]

export default function Home() {
  const [reviews, setReviews] = useState([])
  const [current, setCurrent] = useState(0)
  const router = useRouter();
  const cardData = [
    {
      icon: faDroplet,
      title: "Sweet & Juicy",
      description: "Deliciously sweet with a rich, juicy flavor",
    },
    {
      icon: faLeaf,
      title: "Aromatic",
      description: "Fragrant aroma that is truly irresistible",
    },
    {
      icon: farHeart,
      title: "Nutrient-Rich",
      description: "Packed with essential vitamins and minerals",
    },
    // તમે વધુ card ઉમેરો તો નવી row automatic બની જશે
  ];


  useEffect(() => {
    setReviews(staticReviews)
   
  },[])
   
  useEffect(() => {
    if (reviews.length === 0) return;  // Prevent running if reviews are empty

    // Set interval to automatically change review every 3 seconds
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length)
    },4000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [reviews])  // Only re-run if reviews change (once in this case)
  
  const handleShopNow = () => {
    router.push('/products'); // જે page/open કરવો છે એને અહીં લખ
  };

  if (reviews.length === 0) return <p>Loading...</p>
  


  return (
    <>
      <div className="min-h-screen bg-gray-100 px-4 py-8 md:px-12 lg:px-20 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          {/* Left Box */}
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
               >
                
                Shop Now
              </button>
            </div>
          </div>

          {/* Right Box */}
          <div className="mt-6 md:mt-0">
            <div className="relative overflow-hidden ">
              <img
                src="/istockphoto-450724125-612x612.jpg"
                alt="Delicious Kesar Mangoes"
                className="w-full h-auto object-cover img1"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* ////about */}

        <div className="w-full">
          <h2 className="text-4xl text-center text-green-900 font-semibold">About Kesar Mangoes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {cardData.map((item, index) => {
              const isCenterCard = (index + 1) % 3 === 2;

              return (
                <div
                  key={index}
                  className={`p-4 text-center relative group border-gray-400
            ${isCenterCard ? "border-l border-r" : ""}
          `}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    style={{ height: "49px", width: "49px" }}
                    className="text-green-600 mb-2"
                  />
                  <h5 className="text-2xl text-green-900 font-semibold">{item.title}</h5>
                  <p className="text-green-900">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* deals */}
      <div className="bg-yellow-400 w-full px-4 py-8 md:px-12 lg:px-20 md:py-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="p-4 flex justify-center items-center flex-col">
      <h1 className="text-green-700 sm:text-6xl text-4xl">Best Deals</h1>
      <h3 className="text-white sm:text-8xl text-6xl md:ml-9 lg:ml-25 ">
        20% off
      </h3>
    </div>
    <div className="w-full max-w-sm mx-auto overflow-hidden">
      <img
        src="./kesar-mango.png"
        alt="Kesar Mango"
        className="w-full h-80"
      />
    </div>
  </div>
</div>
<div className="bg-gray-100 pb-6 pt-3">

<h2 className="text-5xl font-bold mb-4 text-green-900 text-center ">Customer Review</h2>
<div className="max-w-md mx-auto p-6  rounded text-center">
     
      <div className="mb-4 transition duration-300 ease-in-out">
        <h3 className="font-semibold text-black">{reviews[current].name}</h3>
        <p className="text-yellow-500">{"★".repeat(reviews[current].rating)}</p>
        <p className="text-gray-700">{reviews[current].review}</p>
      </div>
    </div>
</div>
   
    </>

  );
}