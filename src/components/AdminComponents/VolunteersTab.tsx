import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Mail, X, Search, Calendar } from 'lucide-react';
import adminApi from '../../API/admin';

const fetchVolunteers = async (search: string = "") => {
    const endpoint = search ? `/volunteer?search=${encodeURIComponent(search)}` : '/volunteer';
    const { data } = await adminApi.get(endpoint);
    return data;
};

interface Volunteer {
    volunteer_id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    totalEventsParticipated: number;
}

interface VolunteersTabProps {
    onViewClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
    onSendEmailClick: (volunteer: Volunteer) => void; // Prop baru
}

const VolunteersTab: React.FC<VolunteersTabProps> = ({ onViewClick, onDeleteClick, onSendEmailClick }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: volunteersRaw, isLoading, isError, error } = useQuery({
        queryKey: ['volunteers', debouncedSearch],
        queryFn: () => fetchVolunteers(debouncedSearch),
    });
    
    const volunteers: Volunteer[] = Array.isArray(volunteersRaw) ? volunteersRaw : [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama Volunteer..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border rounded-lg"
                />
            </div>
            <h2 className="text-2xl font-normal text-[#1A3A53] mb-4">Manajemen Volunteers</h2>

            {isLoading && <p>Memuat data volunteers...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            <div className="border rounded-lg text-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1A3A53] text-white font-normal uppercase tracking-wider text-xs">
                    <div className="col-span-3">Nama</div>
                    <div className="col-span-4">Email</div>
                    <div className="col-span-2">Tgl Bergabung</div>
                    <div className="col-span-1">Event Diikuti</div>
                    <div className="col-span-2 text-right">Aksi</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {volunteers.length > 0 ? (
                        volunteers.map((volunteer: Volunteer) => (
                            <div key={volunteer.volunteer_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                                <div className="col-span-3 font-normal text-[#1A3A53]">{volunteer.firstName} {volunteer.lastName}</div>
                                <div className="col-span-4 text-gray-700">{volunteer.email}</div>
                                <div className="col-span-2 text-gray-500 flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(volunteer.createdAt).toLocaleDateString('id-ID')}
                                </div>
                                <div className="col-span-1 text-gray-500 font-normal text-center">{volunteer.totalEventsParticipated}</div>
                                <div className="col-span-2 flex items-center justify-end gap-2 text-gray-500">
                                    <button onClick={() => onSendEmailClick(volunteer)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors" title="Kirim Email"><Mail size={18} /></button>
                                    <button onClick={() => onViewClick(volunteer.volunteer_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                                    <button onClick={() => onDeleteClick(volunteer.volunteer_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"><X size={18} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">Tidak ada volunteer ditemukan.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default VolunteersTab;
