import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';

// Tipe data untuk sebuah artikel, sesuai dengan API
interface Article {
  article_id: number;
  title: string;
  summary: string;
  authorName: string;
  createdAt: string;
  category: {
    categoryName: string;
  };
  image: string;
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-2">
      <div className="relative">
        <img src={article.image} alt={article.title} className="w-full h-56 object-cover" />
        <div className="absolute top-4 right-4 bg-[#79B829] bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {article.category.categoryName}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#1A3A53]">{article.title}</h3>
        <p className="mt-2 text-gray-600 flex-grow text-sm">{article.summary}</p>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{article.authorName}</span></div>
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span></div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link to={`/artikel/detail/${article.article_id}`} className="text-center block text-[#79B829] font-bold hover:underline">
            Baca Selengkapnya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
