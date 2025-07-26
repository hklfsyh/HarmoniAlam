import React from 'react';
import { useQuery } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';
import { ArrowLeft, Calendar, User } from 'lucide-react';

// Fungsi untuk mengambil detail artikel dari API
const fetchArticleDetail = async (id: number) => {
    // Menggunakan endpoint publik karena volunteer tidak punya endpoint detail artikel sendiri
    const { data } = await volunteerApi.get(`/articles/${id}`);
    return data;
};

interface MyArticleDetailProps {
  articleId: number;
  onBack: () => void;
}

const MyArticleDetail: React.FC<MyArticleDetailProps> = ({ articleId, onBack }) => {
    const { data: article, isLoading, isError, error } = useQuery({
        queryKey: ['myArticleDetail', articleId],
        queryFn: () => fetchArticleDetail(articleId),
        enabled: !!articleId,
    });

    if (isLoading) return <p className="text-center p-4">Memuat detail artikel...</p>;
    if (isError) return <p className="text-center p-4 text-red-500">Gagal memuat artikel: {error.message}</p>;

    return (
        <div>
            {/* Header Detail Artikel */}
            <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4">
                <ArrowLeft size={20} />
                Kembali ke Daftar Artikel
            </button>
            <div className="space-y-4">
                <div>
                    <span className="bg-[#79B829] bg-opacity-20 text-white font-semibold px-3 py-1 rounded-full text-sm">
                        {article.category.categoryName}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-[#1A3A53]">{article.title}</h1>
                <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-2"><Calendar size={18} /><span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span></div>
                    <div className="flex items-center gap-2"><User size={18} /><span>{article.authorName}</span></div>
                </div>
            </div>

            {/* Konten Artikel */}
            <div className="my-8">
                <img src={article.imagePath} alt={article.title} className="w-full h-auto max-h-[400px] object-cover rounded-lg" />
            </div>
            <article className="prose max-w-none">
                <p className="font-semibold italic text-gray-600">{article.summary}</p>
                <div className="whitespace-pre-line text-gray-700">
                    {article.content}
                </div>
            </article>
        </div>
    );
};

export default MyArticleDetail;
