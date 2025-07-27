import React from 'react';
import { useQuery } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';

// Tipe data untuk kategori event
interface EventCategoryStat {
  categoryName: string;
  count: number;
}

// Tipe data untuk statistik event
interface EventStats {
  totalCompletedEvents: number;
  totalUpcomingEvents: number;
  totalParticipants: number;
  averageParticipantsPerEvent: number;
  eventsPerCategory: EventCategoryStat[];
}

// Tipe data untuk profil organizer
interface OrganizerProfile {
  status: string;
}


// Fungsi untuk mengambil data statistik dari API
const fetchEventStats = async (): Promise<EventStats> => {
    const { data } = await organizerApi.get<EventStats>('/events/stats');
    return data;
};

// Fungsi untuk mengambil status organizer
const fetchOrganizerProfile = async (): Promise<OrganizerProfile> => {
    const { data } = await organizerApi.get<OrganizerProfile>('/organizer/profile');
    return data;
};

const AnalitikTab: React.FC = () => {
    // Ambil status organizer
    const { data: profile, isLoading: loadingProfile, isError: isErrorProfile, error: errorProfile } = useQuery<OrganizerProfile>({
        queryKey: ['organizerProfileForAnalitik'],
        queryFn: fetchOrganizerProfile,
    });

    // Ambil statistik event hanya jika status organizer sudah approved
    const { data: stats, isLoading: loadingStats, isError: isErrorStats, error: errorStats } = useQuery<EventStats>({
        queryKey: ['organizerEventStats'],
        queryFn: fetchEventStats,
        enabled: !!profile && profile.status?.toLowerCase() === 'approved',
    });

    if (loadingProfile) {
        return <p className="p-4 text-center">Memuat data analitik...</p>;
    }
    if (isErrorProfile) {
        return <p className="p-4 text-center text-red-500">Terjadi kesalahan: {errorProfile.message}</p>;
    }
    if (!profile) {
        return <p className="p-4 text-center">Data profil tidak ditemukan.</p>;
    }
    if (profile.status?.toLowerCase() === 'pending' || profile.status?.toLowerCase() === 'rejected') {
        return <p className="p-4 text-center text-yellow-600 font-semibold">Maaf, Anda belum bisa mengakses halaman ini karena status akun Anda masih <span className='capitalize'>{profile.status}</span>.</p>;
    }
    if (loadingStats) {
        return <p className="p-4 text-center">Memuat data analitik...</p>;
    }
    if (isErrorStats) {
        return <p className="p-4 text-center text-red-500">Terjadi kesalahan: {errorStats.message}</p>;
    }
    if (!stats) {
        return <p className="p-4 text-center">Data statistik tidak ditemukan.</p>;
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
                        stats.eventsPerCategory.map((category: EventCategoryStat, index: number) => (
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
