// src/components/ArticleComponents/ArticleHeader.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext'; 

const ArticleHeader: React.FC = () => {
  const { user, requireLogin } = useAuth(); // Ambil user dan fungsi

  const handleWriteClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault(); // Hentikan navigasi default dari Link
      requireLogin();     // Tampilkan modal
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A3A53]">
            Artikel Lingkungan
          </h1>
          <p className="mt-2 text-gray-600 font-light text-sm sm:text-base">
            Baca artikel terbaru seputar lingkungan, tips kebersihan, dan konservasi alam
          </p>
        </div>
        
        <Link 
          to="/artikel/create"
          onClick={handleWriteClick} // Tambahkan onClick
          className="flex items-center justify-center gap-2 bg-[#79B829] text-white font-normal px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg shadow-md hover:bg-opacity-90 transition-all text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Tulis Artikel
        </Link>
      </div>
    </div>
  );
};

export default ArticleHeader;