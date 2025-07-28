import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-20">
      <SearchX className="text-gray-300" size={120} />
      <h1 className="text-6xl font-bold text-[#1A3A53] mt-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mt-4 max-w-sm">
        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-[#79B829] text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
};

export default NotFoundPage;
