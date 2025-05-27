'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // 👈 password toggle state

  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Please login.');
    }

    return () => {
      setErrorMessage('');
      setSuccessMessage('');
      setFormErrors({});
    };
  }, [searchParams]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';

    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFormErrors({});

    if (!validateForm()) return;

    try {
      await login(email, password);
      // Login successful, redirect handled by useEffect
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <Head>
        <title>Login - Mangoes</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-3">
        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Mangoes Login"
              width={80}
              height={40}
              className="rounded-lg"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-yellow-500 mb-6">Mangoes Login</h2>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 mt-1 text-black text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${formErrors.email ? 'border-red-500' : ''
                  }`}
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 mt-1 text-black text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${formErrors.password ? 'border-red-500' : ''
                  }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 text-sm focus:outline-none"
              >
                {showPassword ? 'hide' : 'show  '}

              </button>
               {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 font-semibold text-white rounded-md ${isLoading ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

