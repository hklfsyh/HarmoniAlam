import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Search, Calendar } from 'lucide-react';
import organizerApi from '../../API/organizer';
import ConfirmationModal from '../ConfirmationModal';
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
}

// Fungsi API untuk hapus artikel
const deleteArticle = async (articleId: number) => {
    await organizerApi.delete(`/articles/${articleId}`);
};

const TotalArtikelTab: React.FC<TotalArtikelTabProps> = ({ onViewClick, onEditClick }) => {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const queryClient = useQueryClient();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [articleToDeleteId, setArticleToDeleteId] = useState<number | null>(null);
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

    const deleteMutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myArticles'] });
            setIsDeleteModalOpen(false);
            setArticleToDeleteId(null);
            setModalMessage("Artikel berhasil dihapus.");
            setIsSuccessModalOpen(true);
        },
        onError: (error: any) => {
            setIsDeleteModalOpen(false);
            setModalMessage(error.response?.data?.message || "Gagal menghapus artikel.");
            setIsErrorModalOpen(true);
        }
    });

    const handleOpenDeleteModal = (id: number) => {
        setArticleToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (articleToDeleteId) {
            deleteMutation.mutate(articleToDeleteId);
        }
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
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Artikel Saya</h2>

            {isLoading && <p>Memuat data artikel...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            <div className="border rounded-lg text-sm overflow-hidden">
                {/* Header Tabel Diperbarui */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                    <div className="col-span-5">Artikel</div>
                    <div className="col-span-2">Kategori</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2">Tanggal</div>
                    <div className="col-span-1 text-right">Aksi</div>
                </div>
                {/* Body Tabel */}
                <div className="divide-y divide-gray-100">
                    {Array.isArray(articles) && articles.length > 0 ? (
                        articles.map((article) => (
                            <div key={article.article_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                                <div className="col-span-5">
                                    <p className="font-bold text-[#1A3A53]">{article.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{article.summary}</p>
                                </div>
                                <div className="col-span-2 text-gray-700">{article.category.categoryName}</div>
                                <div className="col-span-2 text-center">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyles(article.status)}`}>
                                        {article.status}
                                    </span>
                                </div>
                                <div className="col-span-2 text-gray-500 flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(article.createdAt).toLocaleDateString('id-ID')}
                                </div>
                                <div className="col-span-1 flex items-center justify-end gap-2 text-gray-500">
                                    <button onClick={() => onViewClick(article.article_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                                    <button onClick={() => onEditClick(article.article_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"><Pencil size={18} /></button>
                                    <button
                                        className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"
                                        onClick={() => handleOpenDeleteModal(article.article_id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">Anda belum membuat artikel.</div>
                    )}
                </div>
            </div>

            {/* MODALS */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Konfirmasi Hapus Artikel"
                message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat diurungkan."
                isConfirming={deleteMutation.isPending}
            />
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
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
