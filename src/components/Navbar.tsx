// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderNavLinks = () => {
    if (user?.role === 'volunteer') {
      return (
        <>
          <Link to="/" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Home</Link>
          <Link to="/event" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Event</Link>
          <Link to="/artikel" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Artikel</Link>
          <Link to="/profile" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Profile</Link>
        </>
      );
    }
    // Untuk guest (user === null)
    return (
      <>
        <Link to="/" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Home</Link>
        <Link to="/event" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Event</Link>
        <Link to="/artikel" className="text-[#1A3A53] hover:text-[#79B829] font-semibold">Artikel</Link>
      </>
    );
  };

  const renderActionButtons = () => {
    if (user) {
      return (
        <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 font-semibold">
          Logout
        </button>
      );
    }
    return (
      <div className="flex items-center space-x-4">
        <Link to="/login" className="px-4 py-2 text-center text-[#1A3A53] border border-[#1A3A53] rounded-md hover:bg-slate-100 font-semibold transition-colors">
          Login
        </Link>
        <Link to="/register" className="px-4 py-2 text-center text-white bg-[#1A3A53] rounded-md hover:bg-[#79B829] font-semibold transition-colors">
          Register
        </Link>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        
        {/* --- PERUBAHAN DI SINI --- */}
        <Link 
          to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'organizer' ? '/dashboard' : '/'} 
          className="relative flex items-center"
        >
          <div className="w-16 h-10"></div>
          <img 
            src="/Logo_HarmoniAlam.png" 
            alt="Logo" 
            className="absolute top-1/2 -translate-y-1/2 h-20 w-20"
          />
        </Link>
        
        {user?.role !== 'admin' && user?.role !== 'organizer' && (
          <div className="hidden md:flex items-center space-x-8">
            {renderNavLinks()}
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          {renderActionButtons()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;