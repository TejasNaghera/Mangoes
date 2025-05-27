"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuthStore, isAuthenticated } from "../store/authStore";
import { useRouter, usePathname } from 'next/navigation';
import { useCartButtonStore } from '../store/cartButtonStore';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const { user, isAuthenticated } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();
  const isCartPage = pathname === '/cart';
  const { isCartButtonDisabled } = useCartButtonStore();
  const { cart } = useCartStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const menuRef = useRef(null);
  const { logout } = useAuthStore();

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('sm');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    setIsClient(true);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Navigation menu items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Handle navigation item click
  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Handle cart button click
  const handleCartClick = () => {
    if (!isCartPage) {
      setMobileMenuOpen(false);
      router.push('/cart');
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/login');
  };

  // Get responsive classes
  const getLogoClasses = () => {
    switch (screenSize) {
      case 'mobile': return 'text-2xl font-extrabold text-green-900';
      case 'sm': return 'text-3xl font-extrabold text-green-900';
      case 'tablet': return 'text-4xl font-extrabold text-green-900';
      default: return 'text-5xl font-extrabold text-green-900';
    }
  };

  const getNavTextClasses = () => {
    switch (screenSize) {
      case 'tablet': return 'text-lg font-semibold';
      default: return 'text-xl font-semibold';
    }
  };

  const getButtonClasses = () => {
    switch (screenSize) {
      case 'mobile': return 'px-2 py-1 text-sm';
      case 'sm': return 'px-2 py-1 text-sm';
      case 'tablet': return 'px-3 py-2 text-sm';
      default: return 'px-4 py-2 text-base';
    }
  };

  // Early return for SSR
  if (!isClient) return null;
  
  return (    
    <nav className="w-full bg-gray-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={getLogoClasses()}>
            <span className="truncate">KesarMart</span>
          </Link>

          {/* Desktop/Tablet Navigation */}
          <div className="hidden md:flex items-center font-medium gap-2 lg:gap-4 xl:gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path} 
                className={`text-gray-700 hover:text-green-900 transition-colors ${getNavTextClasses()}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop/Tablet Action Buttons */}
          <div className="hidden md:flex gap-2 lg:gap-3 items-center">
            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={handleCartClick}
                disabled={isCartPage || isCartButtonDisabled}
                className={`flex items-center bg-green-900 text-white rounded transition-opacity ${
                  getButtonClasses()
                } ${isCartButtonDisabled || isCartPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800'}`}
              >
                <ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="hidden sm:inline">Cart</span>
              </button>

              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </div>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className={`text-orange-600 font-semibold hover:text-orange-700 transition-colors ${getButtonClasses()}`}
              >
                Login
              </Link>
            ) : (
              <div className="flex gap-1 sm:gap-2 items-center">
                <button
                  onClick={() => router.push("/orders")}
                  className={`text-green-600 font-semibold bg-amber-400 rounded hover:bg-amber-300 transition-colors ${getButtonClasses()}`}
                >
                  <span className="hidden lg:inline">My Orders</span>
                  <span className="lg:hidden">Orders</span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${getButtonClasses()}`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Only show on small screens */}
          <button
            className="md:hidden text-gray-700 focus:outline-none p-1 hover:bg-gray-200 rounded transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Only show on small screens */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden mt-2 bg-white rounded-lg shadow-lg border overflow-hidden"
          >
            {/* Navigation Links */}
            <div className="py-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="border-t border-gray-200 p-3 bg-gray-50 space-y-3">
              {/* Cart Button */}
              <button
                onClick={handleCartClick}
                disabled={isCartPage}
                className={`relative flex items-center justify-between w-full p-3 text-gray-700 bg-white rounded-lg border ${
                  isCartPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <ShoppingCartIcon className="h-5 w-5 mr-3" />
                  <span>View Cart</span>
                </div>

                {totalQuantity > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </span>
                )}
              </button>

              {/* Auth Section */}
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="block w-full p-3 text-center text-orange-600 font-semibold bg-white rounded-lg border hover:bg-orange-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push("/orders");
                    }}
                    className="block w-full p-3 text-center text-green-600 font-semibold bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
                  >
                    My Orders
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full p-3 text-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}