import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import publicApi from '../../API/publicApi';

// Tipe Data untuk Kategori
type Category = {
  category_id: number;
  categoryName: string;
};

// Fungsi untuk mengambil kategori artikel dari API
const fetchArticleCategories = async (): Promise<Category[]> => {
  const { data } = await publicApi.get('/categories/articles');
  return data as Category[];
};

interface ArticleFilterProps {
    setSearchTerm: (term: string) => void;
    setSelectedCategory: (id: number | null) => void;
}

const ArticleFilter: React.FC<ArticleFilterProps> = ({ setSearchTerm, setSelectedCategory }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const { data: categories, isLoading, isError } = useQuery<Category[]>({
      queryKey: ['articleCategories'],
      queryFn: fetchArticleCategories,
  });

  // Debounce effect untuk search input
  useEffect(() => {
      const handler = setTimeout(() => {
          setSearchTerm(localSearch);
      }, 500); // Tunggu 500ms setelah user berhenti mengetik

      return () => {
          clearTimeout(handler);
      };
  }, [localSearch, setSearchTerm]);

  const handleCategoryClick = (id: number | null) => {
      setActiveCategoryId(id);
      setSelectedCategory(id);
  };

  return (
    <div className="my-8">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none font-normal">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari Artikel berdasarkan judul..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 rounded-lg font-normal transition-colors text-sm ${
            activeCategoryId === null
              ? "bg-[#1A3A53] text-white shadow"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Semua
        </button>
        {isLoading && <p className="text-sm text-gray-500">Memuat kategori...</p>}
        {isError && <p className="text-sm text-red-500">Gagal memuat kategori.</p>}
        {categories?.map((category) => (
          <button
            key={category.category_id}
            onClick={() => handleCategoryClick(category.category_id)}
            className={`px-4 py-2 rounded-lg font-normal transition-colors text-sm ${
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

export default ArticleFilter;
