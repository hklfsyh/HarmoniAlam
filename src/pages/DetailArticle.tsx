// src/pages/DetailArticlePage.tsx
import React from 'react';
import ArticleDetailHeader from '../components/DetailArticleComponents/ArticleDetailHeader';
import ArticleDetailContent from '../components/DetailArticleComponents/ArticleDetailContent';

const DetailArticlePage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="container mx-auto max-w-4xl py-12 px-6 mt-16">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
          <ArticleDetailHeader />
          <div className="my-8">
            <img src="/imageTemplateArticle.png" alt="Article visual" className="w-full h-auto max-h-[450px] object-cover rounded-lg" />
          </div>
          <ArticleDetailContent />
        </div>
      </main>
    </div>
  );
};

export default DetailArticlePage;