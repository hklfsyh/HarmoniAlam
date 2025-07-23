// src/components/ArticleComponents/ArticleList.tsx
import React from 'react';
import ArticleCard from './ArticleCard';

const articlesData = Array(6).fill({
  title: 'Tips Mengurangi Sampah Plastik di Rumah',
  excerpt: 'Langkah sederhana yang bisa diterapkan setiap hari untuk mengurangi penggunaan plastik sekali pakai di rumah tangga. Mulai dari menggunakan tas belanja kain hingga...',
  author: 'Haikal',
  date: '20 Juli 2024',
  category: 'Tips Lingkungan',
  imageUrl: '/imageTemplateArticle.png',
});

const ArticleList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articlesData.map((article, index) => (
        <ArticleCard key={index} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;