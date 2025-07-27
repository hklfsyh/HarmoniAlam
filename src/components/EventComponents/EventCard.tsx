import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';
import { Calendar, Users } from 'lucide-react';
import ConfirmationModal from '../ConfirmationModal';

// Fungsi untuk mendaftar event
const registerForEvent = (eventId: number) => {
    return volunteerApi.post(`/events/${eventId}/register`);
};

// Fungsi untuk membatalkan pendaftaran event
const cancelRegistration = (eventId: number) => {
    return volunteerApi.delete(`/events/${eventId}/register`);
};

// Fungsi untuk mengambil event yang diikuti volunteer
const fetchMyRegisteredEvents = async () => {
    const { data } = await volunteerApi.get('/events/my-registered-events');
    return data;
};

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

interface EventCardProps {
    event: Event;
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSuccess, onFailure }) => {
    const { user, requireLogin } = useAuth();
    const queryClient = useQueryClient();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Ambil daftar event yang diikuti untuk mengecek status pendaftaran
    const { data: myEvents } = useQuery({
        queryKey: ['myRegisteredEvents'],
        queryFn: fetchMyRegisteredEvents,
        enabled: !!user && user.role === 'volunteer', // Hanya fetch jika user adalah volunteer
    });

    // Cek apakah volunteer sudah terdaftar di event ini
    const isRegistered = myEvents?.some((e: any) => e.event_id === event.event_id) || false;

    // Mutasi untuk mendaftar
    const registerMutation = useMutation({
        mutationFn: registerForEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['publicEvents'] });
            queryClient.invalidateQueries({ queryKey: ['publicEventDetail', String(event.event_id)] });
            queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
            onSuccess('Pendaftaran berhasil! Terima kasih atas partisipasi Anda.');
        },
        onError: (error: any) => {
            onFailure(error.response?.data?.message || 'Terjadi kesalahan saat mendaftar.');
        }
    });

    // Mutasi untuk membatalkan pendaftaran
    const cancelMutation = useMutation({
        mutationFn: cancelRegistration,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['publicEvents'] });
            queryClient.invalidateQueries({ queryKey: ['publicEventDetail', String(event.event_id)] });
            queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
            onSuccess('Pendaftaran berhasil dibatalkan.');
        },
        onError: (error: any) => {
            onFailure(error.response?.data?.message || 'Terjadi kesalahan saat membatalkan pendaftaran.');
        }
    });

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
            setIsConfirmModalOpen(true);
        } else {
            registerMutation.mutate(event.event_id);
        }
    };

    const handleConfirmCancel = () => {
        cancelMutation.mutate(event.event_id);
        setIsConfirmModalOpen(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col">
            <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-[#1A3A53] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.categoryName}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#1A3A53] mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{event.description}</p>
                
                <div className="space-y-3 mb-6 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Peserta: {event.participants}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-4 border-t">
                    <Link 
                        to={`/event/detail/${event.event_id}`}
                        className="flex-1 text-center bg-[#1A3A53] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                    >
                        Lihat Detail
                    </Link>
                    <button 
                        onClick={handleActionClick} 
                        disabled={registerMutation.isPending || cancelMutation.isPending}
                        className={`flex-1 text-center px-4 py-2 rounded-lg font-semibold transition-colors
                            ${isRegistered 
                                ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200' 
                                : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'}
                            disabled:bg-gray-200 disabled:cursor-not-allowed`}
                    >
                        {registerMutation.isPending || cancelMutation.isPending 
                            ? 'Memproses...' 
                            : isRegistered 
                                ? 'Batal' 
                                : 'Daftar'}
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
                cancelText="Tidak"
                isConfirming={cancelMutation.isPending}
            />
        </div>
    );
};

export default EventCard;