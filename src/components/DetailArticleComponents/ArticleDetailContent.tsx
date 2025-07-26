// src/components/DetailArticleComponents/ArticleDetailContent.tsx
import React from 'react';

const ArticleDetailContent: React.FC<{ article: any }> = ({ article }) => {
  if (!article) return null;
  return (
    <article className="prose lg:prose-lg max-w-none mt-8">
      <img src={article.imagePath} alt={article.title} className="w-full h-auto max-h-[450px] object-cover rounded-lg mb-6" />
      <p className="font-semibold italic text-gray-600">{article.summary}</p>
      <div className="whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
};
export default ArticleDetailContent;
