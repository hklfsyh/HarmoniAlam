// src/components/DetailArticleComponents/ArticleDetailHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const ArticleDetailHeader: React.FC<{ article: any }> = ({ article }) => {
  if (!article) return null;
  return (
    <header>
      <Link to="/artikel" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-6">
        <ArrowLeft size={20} />
        Kembali ke Artikel
      </Link>
      <div>
        <span className="bg-[#79B829] text-white px-3 py-1 rounded-full text-sm font-semibold">
          {article.category.categoryName}
        </span>
      </div>
      <h1 className="text-4xl font-bold text-[#1A3A53] mt-4">
        {article.title}
      </h1>
      <div className="flex items-center gap-6 mt-4 text-gray-500">
        <div className="flex items-center gap-2"><Calendar size={18} /><span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span></div>
        <div className="flex items-center gap-2"><User size={18} /><span>{article.authorName}</span></div>
      </div>
    </header>
  );
};
export default ArticleDetailHeader;
