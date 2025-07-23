// src/components/ProfileComponents/MyArticleDetailHeader.tsx
import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';

interface MyArticleDetailHeaderProps {
  onBack: () => void; // Fungsi untuk kembali ke daftar
}

const MyArticleDetailHeader: React.FC<MyArticleDetailHeaderProps> = ({ onBack }) => {
  return (
    <header>
      <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-6">
        <ArrowLeft size={20} />
        Kembali ke Profil
      </button>

      <div className="flex justify-end items-center gap-2 mb-4">
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Dipublikasi</span>
        <button className="text-sm border px-4 py-1 rounded-md hover:bg-gray-100">Edit</button>
        <button className="text-sm border border-red-500 text-red-500 px-4 py-1 rounded-md hover:bg-red-50">Hapus</button>
      </div>

      <h1 className="text-4xl font-bold text-[#1A3A53]">
        Tips Mengurangi Sampah Plastik di Rumah
      </h1>
      <div className="flex items-center gap-2 mt-4 text-gray-500">
        <Calendar size={18} />
        <span>20 Juli 2024</span>
      </div>
    </header>
  );
};

export default MyArticleDetailHeader;