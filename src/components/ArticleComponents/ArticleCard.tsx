// src/components/ArticleComponents/ArticleCard.tsx
import React from 'react';
import { User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-2">
      <div className="relative">
        <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover" />
        <div className="absolute top-3 left-3 bg-[#79B829] bg-opacity-90 text-white px-3 py-1 rounded-md text-sm font-semibold">
          {article.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#1A3A53]">{article.title}</h3>
        <p className="mt-2 text-gray-600 flex-grow text-sm">{article.excerpt}</p>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{article.author}</span></div>
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{article.date}</span></div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link to="/artikel/detail" className="text-center block text-[#79B829] font-bold hover:underline">
            Baca Selengkapnya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;