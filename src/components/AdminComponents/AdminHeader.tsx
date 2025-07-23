// src/components/AdminComponents/AdminHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
      <h1 className="text-3xl font-bold text-[#1A3A53]">Dashboard Admin</h1>
      <Link 
        to="/admin/artikel/create" // Mengarah ke halaman buat artikel
        className="bg-[#79B829] text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-opacity-90"
      >
        Tulis Artikel Baru
      </Link>
    </div>
  );
};
export default AdminHeader;