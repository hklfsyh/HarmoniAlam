import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '../../API/admin';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface AdminArticleDetailViewProps {
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  articleId: number;
}

type ArticleAuthor = {
    admin?: { admin_id?: number; email?: string };
    organizer?: { orgName?: string };
    volunteer?: { firstName?: string; lastName?: string };
};

type ArticleDetail = {
    title?: string;
    category?: { category_id?: number; categoryName?: string };
    category_id?: number;
    summary?: string;
    content?: string;
    status?: string;
    imagePath?: string;
    createdAt?: string;
    author?: ArticleAuthor;
    authorName?: string;
};

const fetchArticleDetail = async (id: number): Promise<ArticleDetail> => {
    const { data } = await adminApi.get(`/articles/${id}`);
    return data as ArticleDetail;
};

const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'publish':
        case 'published':
            return {
                dot: 'bg-green-500',
                badge: 'bg-green-100 text-green-800',
            };
        case 'draft':
            return {
                dot: 'bg-yellow-500',
                badge: 'bg-yellow-100 text-yellow-800',
            };
        default:
             return {
                dot: 'bg-gray-500',
                badge: 'bg-gray-100 text-gray-800',
            };
    }
};

// Fungsi helper untuk mendapatkan nama penulis dari objek author atau authorName
const getAuthorName = (article?: ArticleDetail): string => {
    if (!article) return 'Penulis Tidak Dikenal';
    if (article.authorName) return article.authorName;
    const author = article.author;
    if (!author) return 'Penulis Tidak Dikenal';
    if (author.admin) return `Admin (${author.admin.email ?? '-'})`;
    if (author.organizer) return author.organizer.orgName ?? '-';
    if (author.volunteer) return `${author.volunteer.firstName ?? ''} ${author.volunteer.lastName ?? ''}`.trim();
    return 'Penulis Tidak Dikenal';
};


const AdminArticleDetailView: React.FC<AdminArticleDetailViewProps> = ({ onBack, onEdit, onDelete, articleId }) => {
    const { data: article, isLoading, isError, error } = useQuery<ArticleDetail>({
        queryKey: ['articleDetail', articleId],
        queryFn: () => fetchArticleDetail(articleId),
        enabled: !!articleId,
    });

    if (isLoading) return <div className="p-8 text-center">Memuat detail artikel...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Terjadi kesalahan: {error.message}</div>;

    const isAuthorAdmin = article?.author?.admin?.admin_id;
    const statusStyle = getStatusStyles(article?.status ?? '');
    const authorName = getAuthorName(article);

    if (!article) return null;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold">
                    <ArrowLeft size={20} />
                    Kembali ke Dashboard
                </button>
                <div className="flex items-center gap-3">
                    {isAuthorAdmin && (
                        <button onClick={onEdit} className="bg-[#79B829] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90">
                            Edit Artikel
                        </button>
                    )}
                    <button onClick={onDelete} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700">
                        Hapus Artikel
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="bg-[#79B829] bg-opacity-20 text-white font-semibold px-3 py-1 rounded-full text-sm">
                        {article.category?.categoryName || article.category?.category_id || article.category_id || 'Kategori Tidak Diketahui'}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`}></div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyle.badge}`}>
                            {article.status || 'publish'}
                        </span>
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-[#1A3A53]">{article.title ?? '-'}</h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500">
                    <div className="flex items-center gap-2"><Calendar size={18} /><span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</span></div>
                    <div className="flex items-center gap-2"><User size={18} /><span>{authorName}</span></div>
                </div>
            </div>
            
            <div className="my-8">
                {article.imagePath && (
                  <img src={article.imagePath} alt={article.title ?? ''} className="w-full h-auto max-h-[450px] object-cover rounded-lg" />
                )}
            </div>

            <article className="prose lg:prose-lg max-w-none">
                <p>{article.summary ?? ''}</p>
                <p>{article.content ? article.content.replace(/\r\n/g, '\n\n') : ''}</p>
            </article>
        </div>
    );
};

export default AdminArticleDetailView;
