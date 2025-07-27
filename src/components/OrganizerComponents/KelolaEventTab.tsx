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
    onDeleteClick: (id: number) => void; // Prop baru
}




const KelolaEventTab: React.FC<KelolaEventTabProps> = ({ onViewClick, onEditClick, onDeleteClick }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

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

            <div className="border rounded-lg text-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                    <div className="col-span-4">Event</div>
                    <div className="col-span-2">Tanggal & Waktu</div>
                    <div className="col-span-2">Lokasi</div>
                    <div className="col-span-1 text-center">Partisipan</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-2 text-right">Aksi</div>
                </div>
                <div className="divide-y divide-gray-100">
                    {Array.isArray(events) && events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.event_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                                <div className="col-span-4 font-bold text-[#1A3A53]">{event.title}</div>
                                <div className="col-span-2 text-gray-500 flex items-center gap-2">
                                    <Calendar size={16} />
                                    <div>
                                        {new Date(event.eventDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        <p className="text-xs">{formatTime(event.eventTime)} WIB</p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-gray-500 flex items-start gap-2">
                                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="col-span-1 font-medium text-center">{event.currentParticipants}/{event.maxParticipants}</div>
                                <div className="col-span-1 text-center">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-2 text-gray-500">
                                    <button onClick={() => onViewClick(event.event_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                                    <button onClick={() => onEditClick(event.event_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"><Pencil size={18} /></button>
                                    <button onClick={() => onDeleteClick(event.event_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">Belum ada event yang dibuat.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default KelolaEventTab;
