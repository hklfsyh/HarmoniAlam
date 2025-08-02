// src/components/AdminComponents/AdminHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react'; // Tambahkan import icon email

const AdminHeader: React.FC<{ onBroadcastClick?: () => void }> = ({ onBroadcastClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
      <h1 className="text-3xl font-normal text-[#1A3A53]">Dashboard Admin</h1>
      <div className="flex gap-3">
        <Link 
          to="/admin/artikel/create"
          className="bg-[#79B829] text-white font-normal px-5 py-2.5 rounded-lg shadow-md hover:bg-opacity-90 flex items-center gap-2"
        >
          <span>Tulis Artikel Baru</span>
        </Link>
        <button
          type="button"
          onClick={onBroadcastClick}
          className="bg-[#1A3A53] text-white font-normal px-5 py-2.5 rounded-lg shadow-md hover:bg-opacity-90 flex items-center gap-2"
        >
          <Mail size={18} />
          <span>Buat Pengumuman</span>
        </button>
      </div>
    </div>
  );
};
export default AdminHeader;