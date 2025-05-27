"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const newIsMobile = width < 768;
      setIsMobile(newIsMobile);
      
      // Auto-collapse on tablet and desktop by default
      if (width >= 768 && width < 1024) {
        setIsCollapsed(true); // Tablet: collapsed by default
      } else if (width >= 1024) {
        // Desktop: keep current state or default to expanded
        if (!isCollapsed && width >= 1024) {
          setIsCollapsed(false);
        }
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Check for auth token - only run on client side
    if (typeof window !== 'undefined') {
      const authToken = localStorage?.getItem('authToken');
      if (!authToken && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [pathname, router]);

  const handleToggle = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const getMainClasses = () => {
    if (pathname === '/login' || !isClient) return 'flex-1';
    
    let classes = 'flex-1 transition-all duration-300 ease-in-out ';
    
    // Only apply margin on non-mobile screens
    if (!isMobile) {
      if (isCollapsed) {
        classes += 'ml-16'; // Collapsed sidebar width
      } else {
        classes += 'ml-64'; // Expanded sidebar width
      }
    }
    
    return classes;
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <title>Kesar Mango</title>
      </head>
      <body className="overflow-x-hidden bg-gradient-to-b from-yellow-300 to-orange-400">
        <div className="flex min-h-screen w-full">
          {pathname !== '/login' && isClient && (
            <Sidebar 
              onToggle={handleToggle} 
              isMobile={isMobile}
              isCollapsed={isCollapsed}
            />
          )}
          <main className={`${getMainClasses()} min-h-screen w-full max-w-full`}>
            <div className="w-full overflow-x-hidden text-yellow-900">
              {/* Add padding for mobile hamburger button */}
              <div className={`${isMobile && pathname !== '/login' && isClient ? 'pt-16' : ''} p-4 w-full`}>
                {children}
              </div>
            </div>
            <Toaster 
              position="top-right" 
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fed7aa',
                  color: '#9a3412',
                  border: '1px solid #fb923c',
                },
              }}
            />
          </main>
        </div>
      </body>
    </html>
  );
}