import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Trash2, Search, Calendar, MapPin } from 'lucide-react';
import adminApi from '../../API/admin';

// Fungsi untuk mengambil data semua event dari API
const fetchAllEvents = async (search: string = "", status: string = "") => {
    let endpoint = '/events/all';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    const { data } = await adminApi.get(endpoint);
    return data;
};
// Tipe data untuk event
interface EventData {
    event_id: number;
    title: string;
    organizerName: string;
    eventDate: string;
    eventTime: string;
    location: string;
    currentParticipants: number;
    maxParticipants: number;
    status: string;
}

// Fungsi untuk memformat waktu dari string ISO
const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// Fungsi untuk style badge status event
const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'upcoming':
            return 'bg-blue-100 text-blue-700';
        case 'completed':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

interface EventsTabProps {
    onViewClick: (id: number) => void;
    onDeleteClick: (id: number) => void; // Prop baru
}

const EventsTab: React.FC<EventsTabProps> = ({ onViewClick, onDeleteClick }) => {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: eventsRaw, isLoading, isError, error } = useQuery({
        queryKey: ['allEvents', debouncedSearch, status],
        queryFn: () => fetchAllEvents(debouncedSearch, status),
    });
    
    const events: EventData[] = Array.isArray(eventsRaw) ? eventsRaw : [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6 flex gap-4 items-center">
                <div className="relative flex-1">
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
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-gray-700 bg-white shadow-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Manajemen Event</h2>

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
                    {events.length > 0 ? (
                        events.map((event: EventData) => (
                            <div key={event.event_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                                <div className="col-span-4">
                                    <p className="font-bold text-[#1A3A53]">{event.title}</p>
                                    <p className="text-xs text-gray-500">by {event.organizerName}</p>
                                </div>
                                <div className="col-span-2 text-gray-500 flex items-center gap-2">
                                    <Calendar size={16} />
                                    <div>
                                        {new Date(event.eventDate).toLocaleDateString('id-ID')}
                                        <p className="text-xs">{formatTime(event.eventTime)} WIB</p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-gray-500 flex items-start gap-2">
                                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="col-span-1 font-medium text-center">{event.currentParticipants}/{event.maxParticipants}</div>
                                <div className="col-span-1 text-center">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyles(event.status)}`}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-2 text-gray-500">
                                    <button onClick={() => onViewClick(event.event_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                                    <button onClick={() => onDeleteClick(event.event_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">Tidak ada event ditemukan.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default EventsTab;
