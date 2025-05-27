'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../store/authStore';

export default function Login() {
  const [hasMounted, setHasMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 password toggle state

  const router = useRouter();
  const { login, error, isLoading, isAuthenticated } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);<></>
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      router.replace('/Orders');
    }
  }, [hasMounted, isAuthenticated, router]);

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-orange-500 text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-orange-800 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-orange-300 text-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-orange-800 mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'} // 👈 toggle between text and password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-orange-300 text-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // 👈 toggle state
              className="absolute top-12 right-3 text-sm  text-orange-600 hover:text-orange-800 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-400 text-white py-3 rounded-md hover:bg-orange-500 transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
