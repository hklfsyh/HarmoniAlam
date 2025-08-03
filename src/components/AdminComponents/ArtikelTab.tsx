import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    // Debounce search input
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    // Reset to first page when search or status changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, status]);

    const { data: articlesRaw, isLoading, isError, error } = useQuery({
        queryKey: ['allArticles', debouncedSearch, status],
        queryFn: () => fetchAllArticles(debouncedSearch, status),
    });

    // Make sure articles is always an array
    const articles: Article[] = Array.isArray(articlesRaw) ? articlesRaw : [];

    // Pagination logic
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArticles = articles.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md">
            <div className="relative mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
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
            
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A3A53] mb-4">Artikel</h2>

            {isLoading && <p>Memuat data artikel...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            {/* Scrollable container for table */}
            <div className="overflow-x-auto border rounded-lg">
                <div className="min-w-[800px]">
                    {/* Header Tabel */}
                    <div className="grid grid-cols-12 gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-6 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                        <div className="col-span-4">Artikel</div>
                        <div className="col-span-2">Penulis</div>
                        <div className="col-span-2">Kategori</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-2">Tanggal</div>
                        <div className="col-span-1 text-right">Aksi</div>
                    </div>

                    {/* Body Tabel */}
                    <div className="divide-y divide-gray-100">
                        {currentArticles.length > 0 ? (
                            currentArticles.map((article: Article) => (
                                <div key={article.article_id} className="grid grid-cols-12 gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-6 py-3 items-center hover:bg-gray-50 transition-colors">
                                    <div className="col-span-4 font-bold text-[#1A3A53] text-sm sm:text-base truncate pr-2" title={article.title}>
                                        {article.title}
                                    </div>
                                    <div className="col-span-2 text-gray-700 text-sm truncate" title={article.author}>
                                        {article.author}
                                    </div>
                                    <div className="col-span-2 text-gray-500 text-sm truncate" title={article.category.categoryName}>
                                        {article.category.categoryName}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full ${getArticleStatusStyles(article.status)} whitespace-nowrap`}>
                                            {article.status || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-gray-500 text-sm">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Calendar size={14} className="flex-shrink-0" />
                                            <span className="whitespace-nowrap">
                                                {new Date(article.createdAt).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end gap-1 text-gray-500">
                                        <button 
                                            onClick={() => onViewClick(article.article_id)} 
                                            className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                            title="Lihat artikel"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {article.author.includes('Admin') && (
                                            <button 
                                                onClick={() => onEditClick(article.article_id)} 
                                                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"
                                                title="Edit artikel"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onDeleteClick(article.article_id)} 
                                            className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"
                                            title="Hapus artikel"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
                                Tidak ada artikel ditemukan.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {articles.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Menampilkan {startIndex + 1}-{Math.min(endIndex, articles.length)} dari {articles.length} artikel
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Show first page, last page, current page, and pages around current page
                                    if (
                                        page === 1 || 
                                        page === totalPages || 
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-[#1A3A53] text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        (page === currentPage - 2 && currentPage > 3) ||
                                        (page === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span key={page} className="px-2 text-gray-400">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArtikelTab;