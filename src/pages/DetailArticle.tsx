import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import publicApi from '../API/publicApi';
import ArticleDetailHeader from '../components/DetailArticleComponents/ArticleDetailHeader';
import ArticleDetailContent from '../components/DetailArticleComponents/ArticleDetailContent';

const fetchArticleDetail = async (id: string) => {
    const { data } = await publicApi.get(`/articles/${id}`);
    return data;
};

const DetailArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();

  const { data: article, isLoading, isError, error } = useQuery({
      queryKey: ['publicArticleDetail', articleId],
      queryFn: () => fetchArticleDetail(articleId!),
      enabled: !!articleId,
  });

  if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Memuat artikel...</div>;
  }

  if (isError) {
      return <div className="flex justify-center items-center h-screen text-red-500">Gagal memuat artikel: {error.message}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="container mx-auto max-w-4xl py-12 px-6 mt-16">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
          <ArticleDetailHeader article={article} />
          <ArticleDetailContent article={article} />
        </div>
      </main>
    </div>
  );
};

export default DetailArticlePage;
