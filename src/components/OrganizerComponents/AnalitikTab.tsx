import React from 'react';
import { useQuery } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';

// Fungsi untuk mengambil data statistik dari API
const fetchEventStats = async () => {
    // Endpoint API Anda adalah /api/events/stats, bukan /api/organizer/stats
    // Saya akan gunakan /api/events/stats sesuai instruksi Anda
    const { data } = await organizerApi.get('/events/stats');
    return data;
};

const AnalitikTab: React.FC = () => {
    const { data: stats, isLoading, isError, error } = useQuery({
        queryKey: ['organizerEventStats'],
        queryFn: fetchEventStats,
    });

    if (isLoading) {
        return <p className="p-4 text-center">Memuat data analitik...</p>;
    }

    if (isError) {
        return <p className="p-4 text-center text-red-500">Terjadi kesalahan: {error.message}</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kartu Statistik Event */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Statistik Event</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Selesai</span>
                        <span className="font-bold text-lg text-[#1A3A53]">{stats.totalCompletedEvents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Akan Datang</span>
                        <span className="font-bold text-lg text-[#1A3A53]">{stats.totalUpcomingEvents}</span>
                    </div>
                    <hr className="my-2"/>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Partisipan</span>
                        <span className="font-bold text-lg text-[#1A3A53]">{stats.totalParticipants}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rata-rata Partisipan</span>
                        <span className="font-bold text-lg text-[#1A3A53]">{stats.averageParticipantsPerEvent}</span>
                    </div>
                </div>
            </div>

            {/* Kartu Kategori Event */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Kategori Event</h2>
                <div className="space-y-3 text-sm">
                    {stats.eventsPerCategory && stats.eventsPerCategory.length > 0 ? (
                        stats.eventsPerCategory.map((category: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-600">{category.categoryName}</span>
                                <span className="font-bold text-lg text-[#1A3A53]">{category.count}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Belum ada event yang dibuat.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalitikTab;
