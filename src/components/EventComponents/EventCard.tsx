import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';

// Fungsi API untuk mendaftar dan mengambil event yang diikuti (tidak berubah)
export const registerForEvent = (eventId: number) => {
    return volunteerApi.post(`/events/${eventId}/register`);
};

const fetchMyRegisteredEvents = async () => {
    const { data } = await volunteerApi.get('/events/my-registered-events');
    return data;
};

const addBookmark = (eventId: number) => volunteerApi.post(`/bookmarks/events/${eventId}`);
const removeBookmark = (eventId: number) => volunteerApi.delete(`/bookmarks/events/${eventId}`);

const fetchBookmarkedEvents = async () => {
    const { data } = await volunteerApi.get('/bookmarks');
    // Ambil semua eventId yang dibookmark
    return data.filter((item: any) => item.eventId !== null).map((item: any) => item.eventId);
};

// Interface (tidak berubah)
interface Event {
    event_id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    participants: string;
    categoryName: string;
    image: string;
}

interface RegisteredEvent {
    event_id: number;
}

// Props diubah untuk menyertakan handler baru
interface EventCardProps {
    event: Event;
    onFailure: (message: string) => void;
    onCancelClick: (event: Event) => void;
    onRegisterClick: (event: Event) => void; // Tambahkan handler untuk register
    isRegistering?: boolean; // Status loading untuk pendaftaran
}

const EventCard: React.FC<EventCardProps> = ({ event, onFailure, onCancelClick, onRegisterClick, isRegistering = false }) => {
    const { user, requireLogin } = useAuth();
    const queryClient = useQueryClient();

    // Logika untuk mengambil data dan mengecek status registrasi (tidak berubah)
    const { data: myEvents } = useQuery({
        queryKey: ['myRegisteredEvents'],
        queryFn: fetchMyRegisteredEvents,
        enabled: !!user && user.role === 'volunteer',
    });

    const isRegistered = Array.isArray(myEvents) && myEvents.some((e: RegisteredEvent) => e.event_id === event.event_id);

    // Bookmark logic (tanpa cek author)
    const { data: bookmarkedEventIds, refetch: refetchBookmark } = useQuery({
        queryKey: ['bookmarkedEvents'],
        queryFn: fetchBookmarkedEvents,
        enabled: !!user,
    });

    const isBookmarked = Array.isArray(bookmarkedEventIds) && bookmarkedEventIds.includes(event.event_id);

    const bookmarkMutation = useMutation({
        mutationFn: () => isBookmarked ? removeBookmark(event.event_id) : addBookmark(event.event_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarkedEvents'] });
            refetchBookmark();
        },
        onError: () => {
            onFailure('Gagal mengubah bookmark.');
        }
    });

    // Handler untuk tombol aksi utama diubah
    const handleActionClick = () => {
        if (!user) {
            requireLogin();
            return;
        }
        if (user.role !== 'volunteer') {
            onFailure('Hanya volunteer yang dapat mendaftar atau membatalkan pendaftaran event.');
            return;
        }
        if (isRegistered) {
            onCancelClick(event); // Panggil fungsi dari parent untuk cancel
        } else {
            onRegisterClick(event); // Panggil fungsi dari parent untuk register
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col h-full">
            <div className="relative">
                {/* ICON BOOKMARK DI POJOK KIRI ATAS */}
                <div className="absolute top-3 left-3 z-10">
                    <button
                        type="button"
                        className={`rounded-full p-1.5 sm:p-2 shadow transition ${isBookmarked ? 'bg-[#79B829]' : 'bg-white/80 hover:bg-[#79B829]/80'}`}
                        aria-label="Bookmark Event"
                        onClick={(e) => {
                            e.stopPropagation();
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
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? 'text-white' : 'text-[#79B829]'}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/>
                        </svg>
                    </button>
                </div>
                
                <img src={event.image} alt={event.title} className="w-full h-40 sm:h-48 object-cover" />
                
                <div className="absolute top-3 right-3 bg-[#1A3A53] text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-light">
                    {event.categoryName}
                </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-normal text-[#1A3A53] mb-2 line-clamp-2">
                    {event.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 flex-grow font-light line-clamp-3">
                    {event.description}
                </p>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-gray-700 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-light">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">
                            {new Date(event.eventDate).toLocaleDateString('id-ID', { 
                                day: '2-digit', 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 font-light">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">Peserta: {event.participants}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-auto pt-4 border-t">
                    <Link 
                        to={`/event/detail/${event.event_id}`}
                        className="flex-1 text-center bg-[#1A3A53] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-normal hover:bg-opacity-90 transition-colors text-sm sm:text-base"
                    >
                        Lihat Detail
                    </Link>
                    <button 
                        onClick={handleActionClick} 
                        disabled={isRegistering}
                        className={`flex-1 text-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base
                            ${isRegistered 
                                ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200' 
                                : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'}
                            disabled:bg-gray-200 disabled:cursor-not-allowed`}
                    >
                        {(() => {
                            if (isRegistering) return 'Memproses...';
                            if (isRegistered) return 'Batal';
                            return 'Daftar';
                        })()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;