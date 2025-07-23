// src/components/ProfileComponents/MyArticleDetail.tsx
import React from 'react';
import MyArticleDetailHeader from './MyArticleDetailHeader';
// Menggunakan kembali komponen dari halaman detail artikel publik
import ArticleDetailContent from '../DetailArticleComponents/ArticleDetailContent';

interface MyArticleDetailProps {
  onBack: () => void;
}

const MyArticleDetail: React.FC<MyArticleDetailProps> = ({ onBack }) => {
  return (
    <div>
      <MyArticleDetailHeader onBack={onBack} />
      <div className="my-8">
        <img src="/imageTemplateArticle.png" alt="Article visual" className="w-full h-auto max-h-[450px] object-cover rounded-lg" />
      </div>
      <ArticleDetailContent />
    </div>
  );
};

export default MyArticleDetail;