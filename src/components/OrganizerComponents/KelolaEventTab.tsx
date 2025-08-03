import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Search, Calendar, MapPin } from 'lucide-react';
import organizerApi from '../../API/organizer';

// Tipe data untuk profil organizer
interface OrganizerProfile {
    status: string;
}

// Tipe data event
interface MyEvent {
    event_id: number;
    title: string;
    eventDate: string;
    eventTime: string;
    location: string;
    currentParticipants: number;
    maxParticipants: number;
    status: string;
}

const fetchMyEvents = async (search: string = ""): Promise<MyEvent[]> => {
    const endpoint = search ? `/events/my-events?search=${encodeURIComponent(search)}` : '/events/my-events';
    const { data } = await organizerApi.get<MyEvent[]>(endpoint);
    return data;
};

const fetchOrganizerProfile = async (): Promise<OrganizerProfile> => {
    const { data } = await organizerApi.get<OrganizerProfile>('/organizer/profile');
    return data;
};

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

interface KelolaEventTabProps {
    onViewClick: (id: number) => void;
    onEditClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
}

const KelolaEventTab: React.FC<KelolaEventTabProps> = ({ onViewClick, onEditClick, onDeleteClick }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    // Ambil status organizer
    const { data: profile, isLoading: loadingProfile, isError: isErrorProfile, error: errorProfile } = useQuery<OrganizerProfile>({
        queryKey: ['organizerProfileForKelolaEvent'],
        queryFn: fetchOrganizerProfile,
    });

    // Ambil event hanya jika status approved
    const { data: events = [], isLoading, isError, error } = useQuery<MyEvent[]>({
        queryKey: ['myEvents', debouncedSearch],
        queryFn: () => fetchMyEvents(debouncedSearch),
        enabled: !!profile && profile.status?.toLowerCase() === 'approved',
    });

    const paginatedEvents = events.slice((page - 1) * pageSize, page * pageSize);

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
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama Event......."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm placeholder:text-gray-400 text-base"
                    style={{ boxShadow: '0 2px 8px rgba(26,58,83,0.06)' }}
                />
            </div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Event Saya</h2>

            {isLoading && <p>Memuat data event...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            {/* Container dengan overflow scroll untuk responsivitas */}
            <div className="w-full overflow-x-auto">
                <div className="border rounded-lg text-sm min-w-[1000px]">
                    {/* Header tabel dengan gap yang responsif */}
                    <div className="grid grid-cols-12 gap-x-3 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 xl:gap-x-8 px-4 sm:px-5 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                        <div className="col-span-3">Event</div>
                        <div className="col-span-2">Tanggal & Waktu</div>
                        <div className="col-span-2">Lokasi</div>
                        <div className="col-span-1 text-center">Partisipan</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-3 text-right">Aksi</div>
                    </div>
                    
                    {/* Body tabel */}
                    <div className="divide-y divide-gray-100">
                        {Array.isArray(paginatedEvents) && paginatedEvents.length > 0 ? (
                            paginatedEvents.map((event) => (
                                <div key={event.event_id} className="grid grid-cols-12 gap-x-3 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 xl:gap-x-8 px-4 sm:px-5 py-3 items-center hover:bg-gray-50 transition-colors">
                                    {/* Event Name */}
                                    <div className="col-span-3 font-bold text-[#1A3A53] break-words">
                                        <div className="line-clamp-2">{event.title}</div>
                                    </div>
                                    
                                    {/* Date & Time */}
                                    <div className="col-span-2 text-gray-500">
                                        <div className="flex items-start gap-1 sm:gap-2">
                                            <Calendar size={14} className="flex-shrink-0 mt-0.5" />
                                            <div className="text-xs sm:text-sm">
                                                <div className="font-medium">
                                                    {new Date(event.eventDate).toLocaleDateString('id-ID', { 
                                                        day: '2-digit', 
                                                        month: 'short', 
                                                        year: 'numeric' 
                                                    })}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {formatTime(event.eventTime)} WIB
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Location */}
                                    <div className="col-span-2 text-gray-500">
                                        <div className="flex items-start gap-1 sm:gap-2">
                                            <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-sm line-clamp-2 break-words">
                                                {event.location}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Participants */}
                                    <div className="col-span-1 font-medium text-center text-xs sm:text-sm">
                                        <div className="bg-gray-100 rounded-full px-2 py-1">
                                            {event.currentParticipants}/{event.maxParticipants}
                                        </div>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="col-span-1 text-center">
                                        <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${
                                            event.status === 'upcoming' 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="col-span-3 flex items-center justify-end gap-1 sm:gap-2 text-gray-500">
                                        <button 
                                            onClick={() => onViewClick(event.event_id)} 
                                            className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                            title="Lihat detail"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                            onClick={() => onEditClick(event.event_id)} 
                                            className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"
                                            title="Edit event"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            onClick={() => onDeleteClick(event.event_id)} 
                                            className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"
                                            title="Hapus event"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 col-span-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-4xl">📅</div>
                                    <div>Belum ada event yang dibuat.</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between sm:justify-end items-center gap-2 mt-4">
                <div className="text-sm text-gray-500 sm:hidden">
                    Halaman {page} dari {Math.ceil(events.length / pageSize) || 1}
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
                        {page} / {Math.ceil(events.length / pageSize) || 1}
                    </span>
                    <button
                        className="px-3 py-1 rounded bg-slate-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors text-sm"
                        disabled={page * pageSize >= events.length}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KelolaEventTab;