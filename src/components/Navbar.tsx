// src/components/Navbar.tsx

import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/Logo_HarmoniAlam.png" alt="Logo" className="h-10 w-10 mr-2" />
        </div>

        {/* Navigation Links (Updated with arbitrary values) */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Home</a>
          <a href="#" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Event</a>
          <a href="#" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Artikel</a>
        </div>

        {/* Login/Register Buttons */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-[#1A3A53] border border-[#1A3A53] rounded-md hover:bg-blue-50 font-semibold">
            Login
          </button>
          <button className="px-4 py-2 text-white bg-[#1A3A53] rounded-md hover:bg-[#79B829] font-semibold">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;