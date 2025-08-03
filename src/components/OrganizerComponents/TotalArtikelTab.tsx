import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Search, Calendar } from 'lucide-react';
import organizerApi from '../../API/organizer';
import SuccessModal from '../SuccessModal';
import ErrorModal from '../ErrorModal';

// Tipe data untuk profil organizer
interface OrganizerProfile {
    status: string;
}

// Tipe data untuk artikel
interface Article {
    article_id: number;
    title: string;
    summary: string;
    category: { categoryName: string };
    status: string;
    createdAt: string;
}

// Fungsi untuk mengambil data artikel milik organizer
const fetchMyArticles = async (search: string = "", status: string = ""): Promise<Article[]> => {
    let endpoint = '/articles/my-articles';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    const { data } = await organizerApi.get<{ articles: Article[] }>(endpoint);
    return data.articles;
};

const fetchOrganizerProfile = async (): Promise<OrganizerProfile> => {
    const { data } = await organizerApi.get<OrganizerProfile>('/organizer/profile');
    return data;
};

// Fungsi untuk style badge status artikel
const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'publish':
            return 'bg-green-100 text-green-700';
        case 'draft':
            return 'bg-yellow-100 text-yellow-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

interface TotalArtikelTabProps {
    onViewClick: (id: number) => void;
    onEditClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
}

const TotalArtikelTab: React.FC<TotalArtikelTabProps> = ({ onViewClick, onEditClick, onDeleteClick }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const queryClient = useQueryClient();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    // Ambil status organizer
    const { data: profile, isLoading: loadingProfile, isError: isErrorProfile, error: errorProfile } = useQuery<OrganizerProfile>({
        queryKey: ['organizerProfileForTotalArtikel'],
        queryFn: fetchOrganizerProfile,
    });

    // Ambil artikel hanya jika status approved
    const { data: articles = [], isLoading, isError, error } = useQuery<Article[]>({
        queryKey: ['myArticles', debouncedSearch, status],
        queryFn: () => fetchMyArticles(debouncedSearch, status),
        enabled: !!profile && profile.status?.toLowerCase() === 'approved',
    });

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        // Refetch data artikel
        queryClient.invalidateQueries({ queryKey: ['myArticles'] });
    };

    if (loadingProfile) {
        return <p className="p-4 text-center">Memuat data...</p>;
    }
    if (isErrorProfile) {
        return <p className="p-4 text-center text-red-500">Gagal memuat status: {errorProfile.message}</p>;
    }
    if (!profile) {
        return <p className="p-4 text-center text-red-500">Data profil tidak ditemukan.</p>;
    }
    if (profile.status?.toLowerCase() === 'pending' || profile.status?.toLowerCase() === 'rejected') {
        return <p className="p-4 text-center text-yellow-600 font-semibold">Maaf, Anda belum bisa mengakses halaman ini karena status akun Anda masih <span className='capitalize'>{profile.status}</span>.</p>;
    }

    const paginatedArticles = articles.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Search dan Filter */}
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
                    className="w-full sm:w-auto py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-gray-700 bg-white shadow-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="publish">Publish</option>
                    <option value="draft">Draft</option>
                </select>
            </div>
            
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Artikel Saya</h2>

            {isLoading && <p>Memuat data artikel...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            {/* Container dengan overflow scroll untuk responsivitas */}
            <div className="w-full overflow-x-auto">
                <div className="border rounded-lg text-sm min-w-[900px]">
                    {/* Header tabel dengan gap yang responsif */}
                    <div className="grid grid-cols-12 gap-x-3 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 xl:gap-x-8 px-4 sm:px-5 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                        <div className="col-span-4">Artikel</div>
                        <div className="col-span-2">Kategori</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-2">Tanggal</div>
                        <div className="col-span-2 text-right">Aksi</div>
                    </div>
                    
                    {/* Body tabel */}
                    <div className="divide-y divide-gray-100">
                        {Array.isArray(paginatedArticles) && paginatedArticles.length > 0 ? (
                            paginatedArticles.map((article) => (
                                <div key={article.article_id} className="grid grid-cols-12 gap-x-3 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 xl:gap-x-8 px-4 sm:px-5 py-3 items-center hover:bg-gray-50 transition-colors">
                                    {/* Article Title & Summary */}
                                    <div className="col-span-4">
                                        <p className="font-bold text-[#1A3A53] line-clamp-2 break-words text-sm sm:text-base">
                                            {article.title}
                                        </p>
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1 break-words">
                                            {article.summary}
                                        </p>
                                    </div>
                                    
                                    {/* Category */}
                                    <div className="col-span-2 text-gray-700 text-xs sm:text-sm">
                                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-center font-medium">
                                            {article.category.categoryName}
                                        </div>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="col-span-2 text-center">
                                        <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full capitalize whitespace-nowrap ${getStatusStyles(article.status)}`}>
                                            {article.status}
                                        </span>
                                    </div>
                                    
                                    {/* Date */}
                                    <div className="col-span-2 text-gray-500">
                                        <div className="flex items-start gap-1 sm:gap-2">
                                            <Calendar size={14} className="flex-shrink-0 mt-0.5" />
                                            <div className="text-xs sm:text-sm">
                                                {new Date(article.createdAt).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="col-span-2 flex items-center justify-end gap-1 sm:gap-2 text-gray-500">
                                        <button 
                                            onClick={() => onViewClick(article.article_id)} 
                                            className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                            title="Lihat artikel"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                            onClick={() => onEditClick(article.article_id)} 
                                            className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"
                                            title="Edit artikel"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"
                                            onClick={() => onDeleteClick(article.article_id)}
                                            title="Hapus artikel"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 col-span-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-4xl">📝</div>
                                    <div>Anda belum membuat artikel.</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between sm:justify-end items-center gap-2 mt-4">
                <div className="text-sm text-gray-500 sm:hidden">
                    Halaman {page} dari {Math.ceil(articles.length / pageSize) || 1}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 rounded bg-slate-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors text-sm"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <span className="text-sm font-semibold px-2 hidden sm:inline">
                        {page} / {Math.ceil(articles.length / pageSize) || 1}
                    </span>
                    <button
                        className="px-3 py-1 rounded bg-slate-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors text-sm"
                        disabled={page * pageSize >= articles.length}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* MODALS */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
                title="Berhasil!"
                message={modalMessage}
                buttonText="Selesai"
            />
            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title="Gagal Menghapus"
                message={modalMessage}
                buttonText="Coba Lagi"
            />
        </div>
    );
};

export default TotalArtikelTab;