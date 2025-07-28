import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '../../API/admin';
import { Search } from 'lucide-react';

// Fungsi untuk mengambil daftar partisipan dari API
const fetchEventVolunteers = async (eventId: number): Promise<VolunteerReg[]> => {
    const { data } = await adminApi.get(`/events/${eventId}/volunteers`);
    return data as VolunteerReg[];
};

interface AdminPartisipanTabProps {
    eventId: number;
}

interface VolunteerReg {
    registration_id: number;
    registeredAt: string;
    volunteer: {
        firstName?: string;
        lastName?: string;
        email?: string;
    };
}

const AdminPartisipanTab: React.FC<AdminPartisipanTabProps> = ({ eventId }) => {
    const { data: volunteers, isLoading, isError, error } = useQuery<VolunteerReg[]>({
        queryKey: ['eventVolunteers', eventId],
        queryFn: () => fetchEventVolunteers(eventId),
        enabled: !!eventId,
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Cari Partisipan..." className="w-full pl-12 pr-4 py-3 border rounded-lg"/>
            </div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Daftar Partisipan</h2>

            {isLoading && <p>Memuat daftar partisipan...</p>}
            {isError && <p className="text-red-500">Gagal memuat data: {error.message}</p>}

            {Array.isArray(volunteers) && (
                <div className="border rounded-lg text-sm overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-slate-50 font-semibold text-gray-500 border-b">
                        <div>Nama</div>
                        <div>Email</div>
                        <div>Tanggal Daftar</div>
                    </div>
                    <div className="divide-y">
                        {volunteers.length > 0 ? (
                            volunteers.map((reg) => (
                                <div key={reg.registration_id} className="grid grid-cols-3 gap-4 px-4 py-3 items-center">
                                    <div className="font-semibold text-[#1A3A53]">{reg.volunteer?.firstName ?? ''} {reg.volunteer?.lastName ?? ''}</div>
                                    <div>{reg.volunteer?.email ?? '-'}</div>
                                    <div>{new Date(reg.registeredAt).toLocaleDateString('id-ID')}</div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-gray-500">Belum ada partisipan yang mendaftar.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPartisipanTab;
