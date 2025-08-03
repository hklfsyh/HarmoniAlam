import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';

// Tipe data untuk sebuah artikel, sesuai dengan API
interface Article {
  article_id: number;
  title: string;
  summary: string;
  authorName: string;
  authorId: number; // tambahkan ini
  createdAt: string;
  category: {
    categoryName: string;
  };
  image: string;
}

interface ArticleCardProps {
  article: Article;
}

// API untuk bookmark artikel
const addBookmarkArticle = (articleId: number) => volunteerApi.post(`/bookmarks/articles/${articleId}`);
const removeBookmarkArticle = (articleId: number) => volunteerApi.delete(`/bookmarks/articles/${articleId}`);

// Ambil semua bookmark, filter articleId saja
const fetchBookmarks = async () => {
  const { data } = await volunteerApi.get('/bookmarks');
  return data.filter((item: any) => item.articleId !== null).map((item: any) => item.articleId);
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { user, requireLogin } = useAuth();
  const queryClient = useQueryClient();

  // Ambil author_id yang login dari endpoint /volunteer/profile
  const { data: profile } = useQuery({
    queryKey: ['volunteerProfile'],
    queryFn: async () => {
      const { data } = await volunteerApi.get('/volunteer/profile');
      return data;
    },
    enabled: !!user,
  });

  // Jangan tampilkan icon bookmark jika artikel milik volunteer yang login
  const isOwnArticle =
    profile &&
    typeof profile.author_id === 'number' &&
    typeof article.authorId === 'number' &&
    profile.author_id === article.authorId;

  // Bookmark logic
  const { data: bookmarkedArticleIds, refetch: refetchBookmark } = useQuery({
    queryKey: ['bookmarkedArticles'],
    queryFn: fetchBookmarks,
    enabled: !!user,
  });

  const isBookmarked = Array.isArray(bookmarkedArticleIds) && bookmarkedArticleIds.includes(article.article_id);

  const bookmarkMutation = useMutation({
    mutationFn: () => isBookmarked ? removeBookmarkArticle(article.article_id) : addBookmarkArticle(article.article_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedArticles'] });
      refetchBookmark();
    },
    onError: () => {
      // Optional: tampilkan error toast
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl h-full">
      <div className="relative">
        {/* ICON BOOKMARK DI POJOK KIRI ATAS */}
        {!isOwnArticle && (
          <div className="absolute top-3 left-3 z-10">
            <button
              type="button"
              className={`rounded-full p-1.5 sm:p-2 shadow transition ${
                isBookmarked
                  ? 'bg-[#79B829]'
                  : 'bg-white/80 hover:bg-[#79B829]/80'
              }`}
              aria-label="Bookmark Artikel"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!user) {
                  requireLogin();
                  return;
                }
                bookmarkMutation.mutate();
              }}
              disabled={bookmarkMutation.isPending}
            >
              {/* SVG Bookmark */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? 'text-white' : 'text-[#79B829]'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/>
              </svg>
            </button>
          </div>
        )}
        
        <img src={article.image} alt={article.title} className="w-full h-40 sm:h-48 lg:h-56 object-cover" />
        
        <div className="absolute top-3 right-3 bg-[#79B829] bg-opacity-90 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-normal">
          {article.category.categoryName}
        </div>
      </div>
      
      <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-normal text-[#1A3A53] mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 flex-grow text-sm sm:text-base font-light mb-4 line-clamp-3">
          {article.summary}
        </p>
        
        {/* Author & Date Info */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mt-auto text-xs sm:text-sm text-gray-500 font-light">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{article.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
        
        {/* Read More Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link 
            to={`/artikel/detail/${article.article_id}`} 
            className="block text-center bg-[#79B829] text-white py-2 px-4 rounded-lg font-normal hover:bg-opacity-90 transition-colors text-sm sm:text-base"
          >
            Baca Selengkapnya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
