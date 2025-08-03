// src/components/DetailArticleComponents/ArticleDetailHeader.tsx
import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';

const addBookmarkArticle = (articleId: number) => volunteerApi.post(`/bookmarks/articles/${articleId}`);
const removeBookmarkArticle = (articleId: number) => volunteerApi.delete(`/bookmarks/articles/${articleId}`);
const fetchBookmarks = async () => {
  const { data } = await volunteerApi.get('/bookmarks');
  return data.filter((item: any) => item.articleId !== null).map((item: any) => item.articleId);
};

const fetchProfile = async () => {
  const { data } = await volunteerApi.get('/volunteer/profile');
  return data;
};

const ArticleDetailHeader: React.FC<{ article: any }> = ({ article }) => {
  const { user, requireLogin } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Ambil profile volunteer yang login
  const { data: profile } = useQuery({
    queryKey: ['volunteerProfile'],
    queryFn: fetchProfile,
    enabled: !!user,
  });

  // Bookmark logic
  const { data: bookmarkedArticleIds, refetch: refetchBookmark } = useQuery({
    queryKey: ['bookmarkedArticles'],
    queryFn: fetchBookmarks,
    enabled: !!user,
  });

  const isBookmarked = Array.isArray(bookmarkedArticleIds) && bookmarkedArticleIds.includes(article?.article_id);

  const bookmarkMutation = useMutation({
    mutationFn: () => isBookmarked ? removeBookmarkArticle(article.article_id) : addBookmarkArticle(article.article_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedArticles'] });
      refetchBookmark();
    },
  });

  // Jangan tampilkan icon bookmark jika artikel milik volunteer yang login
  const isOwnArticle =
    profile &&
    typeof profile.author_id === 'number' &&
    typeof article.author_id === 'number' &&
    profile.author_id === article.author_id;

  // Debug log (optional, untuk cek)
  console.log('profile.author_id:', profile?.author_id, 'article.author_id:', article.author_id, 'isOwnArticle:', isOwnArticle);

  if (!article) return null;
  return (
    <header className="flex items-start justify-between">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-normal mb-6"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div>
          <span className="bg-[#79B829] text-white px-3 py-1 rounded-full text-sm font-normal">
            {article.category.categoryName}
          </span>
        </div>
        <h1 className="text-4xl font-normal text-[#1A3A53] mt-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-6 mt-4 text-gray-500 font-light">
          <div className="flex items-center gap-2"><Calendar size={18} /><span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span></div>
          <div className="flex items-center gap-2"><User size={18} /><span>{article.authorName}</span></div>
        </div>
      </div>
      {/* Bookmark icon di kanan */}
      {!isOwnArticle && (
        <div className="ml-4 mt-2">
          <button
            type="button"
            className={`rounded-full p-2 shadow transition ${
              isBookmarked
                ? 'bg-[#79B829]'
                : 'bg-white/80 hover:bg-[#79B829]/80'
            }`}
            aria-label="Bookmark Artikel"
            onClick={(e) => {
              e.preventDefault();
              if (!user) {
                requireLogin();
                return;
              }
              bookmarkMutation.mutate();
            }}
            disabled={bookmarkMutation.isPending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isBookmarked ? 'text-white' : 'text-[#79B829]'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/>
            </svg>
          </button>
        </div>
      )}
    </header>
  );
};
export default ArticleDetailHeader;
