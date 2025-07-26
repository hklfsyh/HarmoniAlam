import React from 'react';
import { useQuery } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface ViewArticleDetailProps {
  articleId: number;
  onBack: () => void;
  onEdit: () => void;
}

// Fungsi untuk mengambil detail artikel dari API
const fetchArticleDetail = async (id: number) => {
    const { data } = await organizerApi.get(`/articles/${id}`);
    return data;
};

const ViewArticleDetail: React.FC<ViewArticleDetailProps> = ({ articleId, onBack, onEdit }) => {
    const { data: article, isLoading, isError, error } = useQuery({
        queryKey: ['organizerArticleDetail', articleId],
        queryFn: () => fetchArticleDetail(articleId),
        enabled: !!articleId,
    });

    if (isLoading) return <div className="p-8 text-center">Memuat detail artikel...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat artikel: {error.message}</div>;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold">
                    <ArrowLeft size={20} />
                    Kembali ke Daftar Artikel
                </button>
                <div className="flex items-center gap-3">
                    <button onClick={onEdit} className="bg-[#79B829] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90">
                        Edit Artikel
                    </button>
                    <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700">
                        Hapus Artikel
                    </button>
                </div>
            </div>

            {/* Info Artikel */}
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
            
            {/* Gambar */}
            <div className="my-8">
                <img src={article.imagePath} alt={article.title} className="w-full h-auto max-h-[400px] object-cover rounded-lg" />
            </div>

            {/* Konten Artikel */}
            <article className="prose max-w-none">
                <p className="font-semibold italic text-gray-600">{article.summary}</p>
                <div className="whitespace-pre-line text-gray-700">
                    {article.content}
                </div>
            </article>
        </div>
    );
};

export default ViewArticleDetail;
