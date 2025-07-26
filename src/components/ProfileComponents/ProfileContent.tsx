import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';
import { Calendar, Tag } from 'lucide-react'; // Import ikon Tag
import MyArticleDetail from './MyArticleDetail';
import ConfirmationModal from '../ConfirmationModal';

// Fungsi untuk mengambil artikel milik volunteer
const fetchMyArticles = async () => {
    const { data } = await volunteerApi.get('/articles/my-articles');
    return data.articles;
};

// Fungsi untuk mengambil event yang diikuti volunteer
const fetchMyRegisteredEvents = async () => {
    const { data } = await volunteerApi.get('/events/my-registered-events');
    return data;
};

// Fungsi untuk membatalkan pendaftaran event
const cancelRegistration = (eventId: number) => {
    return volunteerApi.delete(`/events/${eventId}/register`);
};

interface Event {
    event_id: number;
    title: string;
    organizerName: string;
    eventDate: string;
    status: string;
}

// Komponen untuk satu kartu di "Event yang Diikuti"
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
            onFailure(error.response?.data?.message || 'Terjadi kesalahan saat membatalkan pendaftaran.');
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
        <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h3 className="font-bold text-[#1A3A53]">{event.title}</h3>
                <p className="text-sm text-gray-500">Organizer: {event.organizerName}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(event.eventDate).toLocaleDateString('id-ID')}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyles(event.status)}`}>
                    {event.status === 'completed' ? 'Selesai' : 'Akan Datang'}
                </span>
                <button 
                    onClick={handleCancelClick} 
                    disabled={cancelMutation.isPending}
                    className="text-xs border px-3 py-1 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    aria-label={`Batal pendaftaran untuk ${event.title}`}
                >
                    {cancelMutation.isPending ? 'Membatalkan...' : 'Batal'}
                </button>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Konfirmasi Pembatalan"
                message={`Apakah Anda yakin ingin membatalkan pendaftaran untuk event "${event.title}"?`}
                confirmText="Ya, Batalkan"
                cancelText="Tidak"
                isConfirming={cancelMutation.isPending}
            />
        </div>
    );
};

// Komponen untuk satu kartu di "Artikel Saya"
const MyArticleCard = ({ article, onViewClick, onEditClick }: { article: any; onViewClick: (id: number) => void; onEditClick: (id: number) => void }) => {
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
            </div>
        </div>
    );
};

interface ProfileContentProps {
    activeTab: 'event' | 'artikel';
    setActiveTab: (tab: 'event' | 'artikel') => void;
    onEditArticle: (id: number) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab, setActiveTab, onEditArticle }) => {
    const [viewingArticleId, setViewingArticleId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const { data: myArticles, isLoading: isLoadingArticles, isError: isErrorArticles } = useQuery({
        queryKey: ['myArticles'],
        queryFn: fetchMyArticles,
        enabled: activeTab === 'artikel',
    });

    const { data: myEvents, isLoading: isLoadingEvents, isError: isErrorEvents } = useQuery({
        queryKey: ['myRegisteredEvents'],
        queryFn: fetchMyRegisteredEvents,
        enabled: activeTab === 'event',
    });

    const handleViewArticle = (id: number) => {
        setViewingArticleId(id);
    };

    const handleBackToList = () => {
        setViewingArticleId(null);
    };

    const handleSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000); // Sembunyikan setelah 3 detik
    };

    const handleFailure = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 3000); // Sembunyikan setelah 3 detik
    };

    return (
        <div>
            <div className="bg-slate-200 p-1 rounded-lg flex">
                <button
                    onClick={() => { setActiveTab('event'); setViewingArticleId(null); }}
                    className={`w-1/2 py-2 rounded-md font-semibold transition-all ${activeTab === 'event' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Event yang Diikuti
                </button>
                <button
                    onClick={() => { setActiveTab('artikel'); setViewingArticleId(null); }}
                    className={`w-1/2 py-2 rounded-md font-semibold transition-all ${activeTab === 'artikel' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
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
                                            onSuccess={handleSuccess}
                                            onFailure={handleFailure}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">Anda belum mengikuti event apa pun.</p>
                                )}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md text-center">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {viewingArticleId ? (
                            <MyArticleDetail 
                                articleId={viewingArticleId} 
                                onBack={handleBackToList}
                            />
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Artikel yang Dibuat</h2>
                                {isLoadingArticles && <p>Memuat artikel Anda...</p>}
                                {isErrorArticles && <p className="text-red-500">Gagal memuat artikel.</p>}
                                {myArticles && (
                                    <div className="space-y-4">
                                        {myArticles.length > 0 ? (
                                            myArticles.map((article: any) => (
                                                <MyArticleCard 
                                                    key={article.article_id} 
                                                    article={article} 
                                                    onViewClick={handleViewArticle}
                                                    onEditClick={onEditArticle}
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