"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MusicalNoteIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";
import { useRouter, usePathname } from 'next/navigation';
import { useCartButtonStore } from '../store/cartButtonStore';
// import { useCartStore } from '../store/cartStore'; // path adjust karo
import useCartStore  from '../store/cartStore'; // path adjust karo

/////LanguageSwitcher
import LanguageSwitcher from './LanguageSwitcher';
export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();
  const isCartPage = pathname === '/cart';
  //Page open disable butann
  const { isCartButtonDisabled } = useCartButtonStore();
  const { cart } = useCartStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

 
  

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <nav className={`w-full ${isClient ? "bg-gray-100" : ""} shadow-md sticky top-0  z-50 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900">
          KesarMart
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center font-medium gap-4 lg:gap-6 text-lg lg:text-2xl">
          <Link href="/" className="text-gray-700 hover:text-green-900">Home</Link>
          <Link href="/products" className="text-gray-700 hover:text-green-900">Products</Link>
          <Link href="/about" className="text-gray-700 hover:text-green-900">About</Link>
          <Link href="/contact" className="text-gray-700 hover:text-green-900">Contact</Link>
        </div>

        <div className="hidden md:flex gap-3 items-center">
        <div className="relative">
      <button
        onClick={() => {
          if (!isCartPage) {
            setMenuOpen(false);
            router.push('/cart');
          }
        }}
        disabled={isCartPage || isCartButtonDisabled}
        className={`flex items-center bg-green-900 text-white px-3 py-1 rounded ${
          isCartButtonDisabled || isCartPage ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <ShoppingCartIcon className="h-5 w-5 mr-1" />
        Add to Cart
      </button>

      {totalQuantity > 0 && (
        <span className="absolute bottom-7 right-[-5px] bg-amber-400 text-green-900 text-xs rounded-full px-1.5">
          {totalQuantity}
        </span>
      )}
    </div>
          {!user ? (
            <Link
              href="/login"
              className="block py-2 text-orange-600 font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/orders"); // 👉 Navigate to order page
              }}
              className="block py-2 text-green-600 font-semibold  bg-amber-400 p-2 rounded"
            >
              My Orders
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 absolute left-0 right-0 shadow-lg z-50">
          <Link
            href="/"
            className="block py-2 text-gray-700 border-b"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block py-2 text-gray-700 border-b"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/about"
            className="block py-2 text-gray-700 border-b"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block py-2 text-gray-700 border-b"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="mt-2 pt-2">
          <button
      onClick={() => {
        if (!isCartPage) {
          setMenuOpen(false);
          router.push('/cart');
        }
      }}
      disabled={isCartPage}
      className={`relative flex items-center py-2 text-gray-700 w-full text-left ${
        isCartPage ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <ShoppingCartIcon className="h-5 w-5 mr-2" />
      Add to Cart

      {totalQuantity > 0 && (
        <span className="absolute top-0 right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
          {totalQuantity}
        </span>
      )}
    </button>
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="block py-2 text-orange-600 font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/orders"); // 👉 Navigate to order page
                }}
                className="block py-2 text-green-600 font-semibold"
              >
                My Orders
              </button>
            )}

    
          </div>
        </div>
      )}
      {/* <LanguageSwitcher /> */}
    </nav>
  );
}
