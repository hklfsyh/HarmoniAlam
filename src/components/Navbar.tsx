// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        
        <Link to="/" className="relative flex items-center">
          <div className="w-16 mr-2"></div>
          <img 
            src="/Logo_HarmoniAlam.png" 
            alt="Logo" 
            className="absolute top-1/2 -translate-y-1/2 h-20 w-20" 
          />
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Home</Link>
          <Link to="/event" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Event</Link>
          <Link to="/artikel" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Artikel</Link>
          <Link to="/profile" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Profile</Link>
          <Link to="/organizer" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Organizer</Link>
          <Link to="/admin" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Admin</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-center text-[#1A3A53] border border-[#1A3A53] rounded-md hover:bg-slate-100 font-semibold transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 text-center text-white bg-[#1A3A53] rounded-md hover:bg-[#79B829] font-semibold transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;