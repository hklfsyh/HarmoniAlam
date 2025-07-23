// src/components/DetailEventOrganizerComponents/DetailEventOrgHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Tambahkan prop 'hideEditButton'
interface DetailEventOrgHeaderProps {
  hideEditButton?: boolean;
}

const DetailEventOrgHeader: React.FC<DetailEventOrgHeaderProps> = ({ hideEditButton = false }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
      <div>
        {/* Link Kembali ini bisa kita buat lebih dinamis nanti, untuk sekarang ke dashboard */}
        <Link to="/organizer" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-2">
          <ArrowLeft size={20} />
          Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-[#1A3A53]">Bersih Pantai Ancol</h1>
        <span className="mt-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
          Akan Datang
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Tombol Edit akan disembunyikan jika hideEditButton adalah true */}
        {!hideEditButton && (
          <button className="bg-[#1A3A53] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90">
            Edit Event
          </button>
        )}
        <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700">
          Hapus Event
        </button>
      </div>
    </div>
  );
};
export default DetailEventOrgHeader;