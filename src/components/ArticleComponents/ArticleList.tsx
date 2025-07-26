import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ArticleCard from './ArticleCard';
import publicApi from '../../API/publicApi'; // Menggunakan API client publik

// Fungsi untuk mengambil data artikel dari API
const fetchArticles = async () => {
    const { data } = await publicApi.get('/articles');
    return data;
};

const ArticleList: React.FC = () => {
    const { data: articles, isLoading, isError, error } = useQuery({
        queryKey: ['publicArticles'],
        queryFn: fetchArticles,
    });

    return (
        <div>
            {isLoading && <p className="text-center">Memuat artikel...</p>}
            {isError && <p className="text-center text-red-500">Gagal memuat artikel: {error.message}</p>}

            {articles && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article: any) => (
                        <ArticleCard key={article.article_id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticleList;
