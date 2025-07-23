// src/components/Layout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Tentukan path di mana footer harus disembunyikan
  const hideFooterPaths = ['/organizer', '/dashboard', '/admin'];
  
  // Cek apakah path saat ini dimulai dengan salah satu path yang harus disembunyikan
  const shouldShowFooter = !hideFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Outlet adalah placeholder di mana komponen halaman (misal HomePage) akan dirender */}
        <Outlet /> 
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default Layout;