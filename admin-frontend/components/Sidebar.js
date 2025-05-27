"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaBox, FaPlus, FaStar, FaSignOutAlt, FaUser, FaArrowLeft, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import useAuthStore from '../store/authStore';

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop collapse
  const [screenSize, setScreenSize] = useState('desktop');
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
        setIsCollapsed(false); // Reset collapse state on mobile
      } else if (width < 1024) {
        setScreenSize('tablet');
        setIsCollapsed(true); // Auto-collapse on tablet
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen); // Mobile toggle
  
  const toggleCollapse = () => {
    if (screenSize === 'mobile') return; // Don't allow collapse on mobile
    
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) onToggle(newCollapsedState); // Notify layout of collapse state
  };

const handleLogout = () => {
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (confirmed) {
    logout(); // your logout logic
    router.push('/login');
    setIsOpen(false); // optional: close mobile menu
  }
};


  const handleMenuClick = () => {
    if (screenSize === 'mobile') {
      setIsOpen(false); // Close mobile menu after click
    }
  };

  const menuItems = [
    { name: 'Orders', icon: <FaBox />, path: '/Orders' },
    { name: 'Add Product', icon: <FaPlus />, path: '/AddProduct' },
    { name: 'Customer Reviews', icon: <FaStar />, path: '/Reviews' },
    { name: 'Logout', icon: <FaSignOutAlt />, action: handleLogout },
  ];

  // Dynamic width based on screen size and collapse state
  const getSidebarWidth = () => {
    if (screenSize === 'mobile') return 'w-64'; // Fixed width on mobile
    if (screenSize === 'tablet') return isCollapsed ? 'w-16' : 'w-48'; // Smaller expanded width on tablet
    return isCollapsed ? 'w-16' : 'w-64'; // Full width on desktop
  };

  return (
    <div className="flex">
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white bg-opacity-90 rounded-md p-2 shadow-lg text-yellow-800 hover:text-orange-900 transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 ${getSidebarWidth()} bg-gradient-to-b from-yellow-300 to-orange-400 text-yellow-900 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-all duration-300 ease-in-out z-40 shadow-lg`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-orange-200">
          {/* Logo */}
          {(!isCollapsed || screenSize === 'mobile') && (
            <div className="flex-1">
              <h1 className={`font-bold text-orange-800 ${
                screenSize === 'tablet' ? 'text-lg' : 'text-2xl'
              }`}>
                Kesar Mango
              </h1>
            </div>
          )}

          {/* Collapse Button (Desktop & Tablet only) */}
          {screenSize !== 'mobile' && (
            <button 
              onClick={toggleCollapse} 
              className="text-orange-800 hover:text-orange-900 transition-colors p-1 hover:bg-orange-200 rounded"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? 
                <FaArrowRight className="w-4 h-4" /> : 
                <FaArrowLeft className="w-4 h-4" />
              }
            </button>
          )}
        </div>

        {/* Customer Profile */}
        {(!isCollapsed || screenSize === 'mobile') && (
          <div className="p-4 border-b border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FaUser className="text-orange-800 text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                {user ? (
                  <>
                    <p className={`font-semibold truncate ${
                      screenSize === 'tablet' ? 'text-sm' : 'text-base'
                    }`}>
                      {user.name || user.username || 'No Name'}
                    </p>
                    <p className={`text-orange-700 truncate ${
                      screenSize === 'tablet' ? 'text-xs' : 'text-sm'
                    }`}>
                      {user.email}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Guest</p>
                    <p className="text-sm text-orange-700">Please log in</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Profile (Icon only) */}
        {isCollapsed && screenSize !== 'mobile' && (
          <div className="p-4 border-b border-orange-200 flex justify-center">
            <FaUser className="text-orange-800 text-xl" />
          </div>
        )}

        {/* Menu Items */}
        <nav className="mt-4 flex-1 overflow-y-auto z-30">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.path ? (
                <Link
                  href={item.path}
                  onClick={handleMenuClick}
                  className={`flex items-center px-4 py-3 hover:bg-orange-300 transition-colors ${
                    pathname === item.path ? 'bg-orange-500 text-white' : ''
                  } ${isCollapsed && screenSize !== 'mobile' ? 'justify-center' : ''} ${
                    screenSize === 'tablet' ? 'text-sm' : 'text-base'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {(!isCollapsed || screenSize === 'mobile') && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={item.action}
                  className={`flex items-center w-full px-4 py-3 hover:bg-orange-300 transition-colors text-left ${
                    isCollapsed && screenSize !== 'mobile' ? 'justify-center' : ''
                  } ${screenSize === 'tablet' ? 'text-sm' : 'text-base'}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {(!isCollapsed || screenSize === 'mobile') && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && screenSize === 'mobile' && (
        <div
          className="fixed inset-0  bg-opacity-50 z-30 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;