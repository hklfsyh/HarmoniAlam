import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';
import { Calendar, Tag } from 'lucide-react';
import MyArticleDetail from './MyArticleDetail';
import ConfirmationModal from '../ConfirmationModal';

// --- FUNGSI-FUNGSI API ---
// --- TIPE DATA ---
interface Article {
    article_id: number;
    title: string;
    createdAt: string;
    status: string;
    category: {
        categoryName: string;
    };
}

const fetchMyArticles = async (): Promise<Article[]> => {
    const { data } = await volunteerApi.get('/articles/my-articles');
    return (data as { articles: Article[] }).articles;
};

const fetchMyRegisteredEvents = async (): Promise<Event[]> => {
    const { data } = await volunteerApi.get('/events/my-registered-events');
    return data as Event[];
};

const cancelRegistration = (eventId: number) => {
    return volunteerApi.delete(`/events/${eventId}/register`);
};

// --- TIPE DATA ---
interface Event {
    event_id: number;
    title: string;
    organizerName: string;
    eventDate: string;
    status: string;
}

// --- KOMPONEN KARTU EVENT ---
const JoinedEventCard = ({ event, onSuccess, onFailure }: { event: Event; onSuccess: (message: string) => void; onFailure: (message: string) => void }) => {
    const queryClient = useQueryClient();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const cancelMutation = useMutation({
        mutationFn: cancelRegistration,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
            queryClient.invalidateQueries({ queryKey: ['publicEvents'] });
            onSuccess('Pendaftaran berhasil dibatalkan.');
        },
        onError: (error: any) => {
            // Tipe error dari axios
            if (error && typeof error === 'object' && 'response' in error) {
                onFailure(error.response?.data?.message || 'Terjadi kesalahan saat membatalkan pendaftaran.');
            } else {
                onFailure('Terjadi kesalahan saat membatalkan pendaftaran.');
            }
        }
    });

    const handleCancelClick = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmCancel = () => {
        cancelMutation.mutate(event.event_id);
        setIsConfirmModalOpen(false);
    };

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'upcoming': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <>
            <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="font-bold text-[#1A3A53]">{event.title}</h3>
                    <p className="text-sm text-gray-500">Organizer: {event.organizerName}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1"><Calendar size={14} /><span>{new Date(event.eventDate).toLocaleDateString('id-ID')}</span></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyles(event.status)}`}>
                        {event.status === 'completed' ? 'Selesai' : 'Akan Datang'}
                    </span>
                    <button 
                        onClick={handleCancelClick} 
                        disabled={cancelMutation.isPending || event.status === 'completed'}
                        className="text-xs border px-3 py-1 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
                        aria-label={`Batal pendaftaran untuk ${event.title}`}
                    >
                        {cancelMutation.isPending ? 'Membatalkan...' : 'Batal'}
                    </button>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Konfirmasi Pembatalan"
                message={`Apakah Anda yakin ingin membatalkan pendaftaran untuk event "${event.title}"?`}
                confirmText="Ya, Batalkan"
                isConfirming={cancelMutation.isPending}
            />
        </>
    );
};

// --- KOMPONEN KARTU ARTIKEL ---
const MyArticleCard = ({ article, onViewClick, onEditClick, onDeleteClick }: {
    article: Article;
    onViewClick: (id: number) => void;
    onEditClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
}) => {
    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'publish': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h3 className="font-bold text-[#1A3A53]">{article.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag size={14} />
                        <span>{article.category.categoryName}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyles(article.status)}`}>
                    {article.status}
                </span>
                <button onClick={() => onEditClick(article.article_id)} className="text-xs border px-3 py-1 rounded-md hover:bg-gray-100">Edit</button>
                <button onClick={() => onViewClick(article.article_id)} className="text-xs border px-3 py-1 rounded-md hover:bg-gray-100">Lihat</button>
                <button onClick={() => onDeleteClick(article.article_id)} className="text-xs border px-3 py-1 rounded-md text-red-600 border-red-300 hover:bg-red-50">Hapus</button>
            </div>
        </div>
    );
};

// --- PROPS KOMPONEN UTAMA ---
interface ProfileContentProps {
  activeTab: 'event' | 'artikel';
  setActiveTab: (tab: 'event' | 'artikel') => void;
  onEditArticle: (id: number) => void;
  onDeleteArticle: (id: number) => void;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
}

// --- KOMPONEN UTAMA ---
const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab, setActiveTab, onEditArticle, onDeleteArticle, onSuccess, onFailure }) => {
    const [viewingArticleId, setViewingArticleId] = useState<number | null>(null);

    const { data: myArticles, isLoading: isLoadingArticles, isError: isErrorArticles } = useQuery<Article[]>({
        queryKey: ['myArticles'],
        queryFn: fetchMyArticles,
        enabled: activeTab === 'artikel',
    });

    const { data: myEvents, isLoading: isLoadingEvents, isError: isErrorEvents } = useQuery<Event[]>({
        queryKey: ['myRegisteredEvents'],
        queryFn: fetchMyRegisteredEvents,
        enabled: activeTab === 'event',
    });

    const handleViewArticle = (id: number) => { setViewingArticleId(id); };
    const handleBackToList = () => { setViewingArticleId(null); };

    return (
        <div>
            <div className="bg-slate-200 p-1 rounded-lg flex">
                <button onClick={() => { setActiveTab('event'); setViewingArticleId(null); }} className={`w-1/2 py-2 rounded-md font-semibold transition-all ${activeTab === 'event' ? 'bg-white shadow' : 'text-gray-600'}`}>
                    Event yang Diikuti
                </button>
                <button onClick={() => { setActiveTab('artikel'); setViewingArticleId(null); }} className={`w-1/2 py-2 rounded-md font-semibold transition-all ${activeTab === 'artikel' ? 'bg-white shadow' : 'text-gray-600'}`}>
                    Artikel Saya
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                {activeTab === 'event' ? (
                    <div>
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Event yang Diikuti</h2>
                        {isLoadingEvents && <p>Memuat event Anda...</p>}
                        {isErrorEvents && <p className="text-red-500">Gagal memuat event.</p>}
                        {myEvents && (
                            <div className="space-y-4">
                                {myEvents.length > 0 ? (
                                    myEvents.map((event: Event) => (
                                        <JoinedEventCard 
                                            key={event.event_id} 
                                            event={event} 
                                            onSuccess={onSuccess}
                                            onFailure={onFailure}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">Anda belum mengikuti event apa pun.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {viewingArticleId ? (
                            <MyArticleDetail 
                                articleId={viewingArticleId} 
                                onBack={handleBackToList} 
                                onEdit={onEditArticle} 
                                onDelete={onDeleteArticle} 
                            />
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Artikel yang Dibuat</h2>
                                {isLoadingArticles && <p>Memuat artikel Anda...</p>}
                                {isErrorArticles && <p className="text-red-500">Gagal memuat artikel.</p>}
                                {myArticles && (
                                    <div className="space-y-4">
                                        {myArticles.length > 0 ? (
                                            myArticles.map((article) => (
                                                <MyArticleCard
                                                    key={article.article_id}
                                                    article={article}
                                                    onViewClick={handleViewArticle}
                                                    onEditClick={onEditArticle}
                                                    onDeleteClick={onDeleteArticle}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Anda belum membuat artikel apa pun.</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileContent;
