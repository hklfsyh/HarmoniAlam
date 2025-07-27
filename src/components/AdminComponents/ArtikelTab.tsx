import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Search, Calendar } from 'lucide-react';
import adminApi from '../../API/admin';

// Fungsi untuk mengambil data artikel dari API
const fetchAllArticles = async (search: string = "", status: string = "") => {
    let endpoint = '/articles/all';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    const { data } = await adminApi.get(endpoint);
    return data;
};
// Tipe data untuk artikel
interface Article {
    article_id: number;
    title: string;
    author: string;
    category: { categoryName: string };
    status: string;
    createdAt: string;
}

// Fungsi untuk style badge status artikel
const getArticleStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'publish':
            return 'bg-green-100 text-green-700';
        case 'draft':
            return 'bg-yellow-100 text-yellow-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

interface ArtikelTabProps {
    onViewClick: (id: number) => void;
    onEditClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
}

const ArtikelTab: React.FC<ArtikelTabProps> = ({ onViewClick, onEditClick, onDeleteClick }) => {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");

    // Debounce search input
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: articlesRaw, isLoading, isError, error } = useQuery({
        queryKey: ['allArticles', debouncedSearch, status],
        queryFn: () => fetchAllArticles(debouncedSearch, status),
    });
    // Make sure articles is always an array
    const articles: Article[] = Array.isArray(articlesRaw) ? articlesRaw : [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama Artikel......."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm placeholder:text-gray-400 text-base"
                        style={{ boxShadow: '0 2px 8px rgba(26,58,83,0.06)' }}
                    />
                </div>
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-gray-700 bg-white shadow-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="publish">Publish</option>
                    <option value="draft">Draft</option>
                </select>
            </div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Artikel</h2>

            {isLoading && <p>Memuat data artikel...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            <div className="border rounded-lg text-sm overflow-hidden">
                {/* Header Tabel Diperbarui */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                    <div className="col-span-4">Artikel</div>
                    <div className="col-span-2">Penulis</div>
                    <div className="col-span-2">Kategori</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-2">Tanggal</div>
                    <div className="col-span-1 text-right">Aksi</div>
                </div>

                {/* Body Tabel */}
                <div className="divide-y divide-gray-100">
                    {articles.length > 0 ? (
                        articles.map((article: Article) => (
                            <div key={article.article_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                                <div className="col-span-4 font-bold text-[#1A3A53]">{article.title}</div>
                                <div className="col-span-2 text-gray-700">{article.author}</div>
                                <div className="col-span-2 text-gray-500">{article.category.categoryName}</div>
                                <div className="col-span-1 text-center">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getArticleStatusStyles(article.status)}`}>
                                        {article.status || 'N/A'}
                                    </span>
                                </div>
                                <div className="col-span-2 text-gray-500 flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(article.createdAt).toLocaleDateString('id-ID')}
                                </div>
                                <div className="col-span-1 flex items-center justify-end gap-2 text-gray-500">
                                    <button onClick={() => onViewClick(article.article_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                                    {article.author.includes('Admin') && (
                                        <button onClick={() => onEditClick(article.article_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"><Pencil size={18} /></button>
                                    )}
                                    <button onClick={() => onDeleteClick(article.article_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">Tidak ada artikel ditemukan.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ArtikelTab;
