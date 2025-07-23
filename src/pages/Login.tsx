// src/pages/LoginPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';


const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 mt-16">
        <div className="text-center mb-8">
          <img src="/Logo_HarmoniAlam.png" alt="Logo" className="mx-auto h-44 w-44" />
          <p className="text-gray-600">Join the environmental Movement</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-[#1A3A53]">Welcome</h2>
            <p className="text-gray-500 mt-1">Sign in to your HarmoniAlam account</p>
          </div>

          <form className="mt-8 space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79B829] focus:border-transparent"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79B829] focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link to="/register" className="font-semibold text-[#79B829] hover:underline">
                Register
              </Link>
              <a href="#" className="font-medium text-gray-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#1A3A53] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3A53] transition-all"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </main>

    </div>
  );
};

export default LoginPage;