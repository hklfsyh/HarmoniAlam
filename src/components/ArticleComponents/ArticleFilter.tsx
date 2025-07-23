// src/components/ArticleComponents/ArticleFilter.tsx
import React from 'react';
import { Search } from 'lucide-react';

const categories = ["Semua", "Tips Lingkungan", "DIY", "Teknologi"];

const ArticleFilter: React.FC = () => {
  return (
    <div className="my-8">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari Artikel..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              category === "Tips Lingkungan"
                ? "bg-[#1A3A53] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArticleFilter;