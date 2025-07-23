// src/pages/RegisterPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';


const RegisterPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 mt-16">
        <div className="text-center mb-8">
          <img src="/Logo_HarmoniAlam.png" alt="Logo" className="mx-auto h-44 w-44" />
          <p className="text-gray-600">Join the environmental Movement</p>
        </div>

        {/* Register Card */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-2xl">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-[#1A3A53]">Create Account</h2>
            <p className="text-gray-500 mt-1">Join HarmoniAlam and start making a difference</p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Ahmad"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              {/* Last Name */}
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Rudi"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                />
              </div>
            </div>

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
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
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
                required
                placeholder="Create a strong password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                placeholder="Confirm your password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <div className="text-right text-sm">
              <Link to="/login" className="font-semibold text-gray-500 hover:underline">
                Already have an account?
              </Link>
            </div>

            {/* Sign Up Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#1A3A53] hover:bg-opacity-90"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </main>

    </div>
  );
};

export default RegisterPage;