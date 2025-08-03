import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ArticleCard from './ArticleCard';
import publicApi from '../../API/publicApi';

// Tipe data untuk sebuah artikel, sesuai dengan API
interface Article {
  article_id: number;
  title: string;
  summary: string;
  authorName: string;
  authorId: number; 
  createdAt: string;
  category: {
    categoryName: string;
  };
  image: string;
}

// Fungsi untuk mengambil data artikel dari API dengan filter
const fetchArticles = async (searchTerm: string, categoryId: number | null): Promise<Article[]> => {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append('search', searchTerm);
  }
  if (categoryId) {
    params.append('category', String(categoryId));
  }
  const { data } = await publicApi.get(`/articles?${params.toString()}`);
  // Map author_id ke authorId agar ArticleCard dapat field yang benar
  return data.map((item: any) => ({
    ...item,
    authorId: item.author_id, // tambahkan ini!
  })) as Article[];
};

interface ArticleListProps {
    searchTerm: string;
    selectedCategory: number | null;
}

const ArticleList: React.FC<ArticleListProps> = ({ searchTerm, selectedCategory }) => {
  const { data: articles, isLoading, isError, error } = useQuery<Article[], Error>({
    // Query key sekarang menyertakan filter agar data di-fetch ulang saat filter berubah
    queryKey: ['publicArticles', searchTerm, selectedCategory],
    queryFn: () => fetchArticles(searchTerm, selectedCategory),
  });

    return (
        <div>
            {isLoading && <p className="text-center mt-8">Mencari artikel...</p>}
            {isError && <p className="text-center mt-8 text-red-500">Gagal memuat artikel: {error.message}</p>}

      {articles && (
        articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.article_id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-normal text-gray-700">Tidak Ada Artikel yang Ditemukan</h3>
            <p className="text-gray-500 mt-2 font-light">Coba gunakan kata kunci atau filter kategori yang berbeda.</p>
          </div>
        )
      )}
        </div>
    );
};

export default ArticleList;
