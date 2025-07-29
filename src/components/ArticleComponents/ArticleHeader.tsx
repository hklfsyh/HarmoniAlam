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
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 className="text-4xl font-normal text-[#1A3A53]">Artikel Lingkungan</h1>
        <p className="mt-2 text-gray-600 font-light">
          Baca artikel terbaru seputar lingkungan, tips kebersihan, dan konservasi alam
        </p>
      </div>
      <Link 
        to="/artikel/create"
        onClick={handleWriteClick} // Tambahkan onClick
        className="flex items-center justify-center gap-2 bg-[#79B829] text-white font-normal px-5 py-3 rounded-lg shadow-md hover:bg-opacity-90 transition-all"
      >
        <Plus className="h-5 w-5" />
        Tulis Artikel
      </Link>
    </div>
  );
};

export default ArticleHeader;