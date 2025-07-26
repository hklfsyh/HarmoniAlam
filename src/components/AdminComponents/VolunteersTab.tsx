import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, X, Search, Calendar } from 'lucide-react';
import adminApi from '../../API/admin';

const fetchVolunteers = async () => {
    const { data } = await adminApi.get('/volunteer');
    return data;
};

interface VolunteersTabProps {
    onViewClick: (id: number) => void;
}

const VolunteersTab: React.FC<VolunteersTabProps> = ({ onViewClick }) => {
    const { data: volunteers, isLoading, isError, error } = useQuery({
        queryKey: ['volunteers'],
        queryFn: fetchVolunteers,
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama Volunteer......."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm placeholder:text-gray-400 text-base"
                    style={{ boxShadow: '0 2px 8px rgba(26,58,83,0.06)' }}
                />
            </div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Manajemen Volunteers</h2>

            {isLoading && <p>Memuat data volunteers...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            {volunteers && (
                <div className="border rounded-lg text-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                        <div className="col-span-3">Nama</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-2">Tgl Bergabung</div>
                        <div className="col-span-1">Event Diikuti</div>
                        <div className="col-span-2 text-right">Aksi</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {volunteers.map((volunteer: any) => (
                            <div key={volunteer.volunteer_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                                <div className="col-span-3 font-bold text-[#1A3A53]">{volunteer.firstName} {volunteer.lastName}</div>
                                <div className="col-span-4 text-gray-700">{volunteer.email}</div>
                                <div className="col-span-2 text-gray-500 flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(volunteer.createdAt).toLocaleDateString('id-ID')}
                                </div>
                                <div className="col-span-1 text-gray-500 font-medium text-center">{volunteer.totalEventsParticipated}</div>
                                <div className="col-span-2 flex items-center justify-end gap-2 text-gray-500">
                                    <button onClick={() => onViewClick(volunteer.volunteer_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                                    <button className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"><X size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
export default VolunteersTab;