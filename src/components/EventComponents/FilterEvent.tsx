import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import publicApi from '../../API/publicApi';

// Tipe Data untuk Kategori
type Category = {
  category_id: number;
  categoryName: string;
};

// Fungsi untuk mengambil kategori event dari API
const fetchEventCategories = async (): Promise<Category[]> => {
  const { data } = await publicApi.get('/categories/events');
  return data as Category[];
};

interface FilterEventProps {
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (id: number | null) => void;
}

const FilterEvent: React.FC<FilterEventProps> = ({ setSearchTerm, setSelectedCategory }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['eventCategories'],
    queryFn: fetchEventCategories,
  });

  // Debounce effect untuk search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, setSearchTerm]);

  const handleCategoryClick = (id: number | null) => {
    setActiveCategoryId(id);
    setSelectedCategory(id);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 my-6 sm:my-8">
      {/* Search Input */}
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari Event berdasarkan judul..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:ring-2 focus:ring-[#1A3A53] focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-normal transition-colors text-xs sm:text-sm ${
            activeCategoryId === null
              ? "bg-[#1A3A53] text-white shadow"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Semua
        </button>
        
        {isLoading && (
          <p className="text-xs sm:text-sm text-gray-500">Memuat kategori...</p>
        )}
        
        {isError && (
          <p className="text-xs sm:text-sm text-red-500">Gagal memuat kategori.</p>
        )}
        
        {categories?.map((category) => (
          <button
            key={category.category_id}
            onClick={() => handleCategoryClick(category.category_id)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-normal transition-colors text-xs sm:text-sm whitespace-nowrap ${
              activeCategoryId === category.category_id
                ? "bg-[#1A3A53] text-white shadow"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterEvent;
