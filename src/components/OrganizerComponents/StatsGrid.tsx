import React from 'react';
import type { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, Clock, TrendingUp, FileText } from 'lucide-react';
import organizerApi from '../../API/organizer';

// Tipe props untuk StatCard
interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactElement;
  color: string;
}

// Komponen untuk satu kartu statistik
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-[#1A3A53]">{value}</p>
    </div>
    <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
      {icon}
    </div>
  </div>
);

// Komponen placeholder saat loading
const StatCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
);


// Tipe data untuk statistik organizer
interface OrganizerStats {
  totalEvents: number;
  totalParticipants: number;
  totalUpcomingEvents: number;
  totalCompletedEvents: number;
  totalArticles: number;
}

// Tipe data untuk profil organizer
interface OrganizerProfile {
  status: string;
}

// Fungsi untuk mengambil data statistik dari API
const fetchOrganizerStats = async (): Promise<OrganizerStats> => {
    const { data } = await organizerApi.get<OrganizerStats>('/organizer/stats');
    return data;
};

// Fungsi untuk mengambil status organizer
const fetchOrganizerProfile = async (): Promise<OrganizerProfile> => {
    const { data } = await organizerApi.get<OrganizerProfile>('/organizer/profile');
    return data;
};


const StatsGrid: React.FC = () => {
    // Ambil status organizer
    const { data: profile, isLoading: loadingProfile, isError: isErrorProfile, error: errorProfile } = useQuery<OrganizerProfile>({
        queryKey: ['organizerProfileForStats'],
        queryFn: fetchOrganizerProfile,
    });

    // Ambil statistik hanya jika status approved
    const { data: stats, isLoading: loadingStats, isError: isErrorStats, error: errorStats } = useQuery<OrganizerStats>({
        queryKey: ['organizerStats'],
        queryFn: fetchOrganizerStats,
        enabled: !!profile && profile.status?.toLowerCase() === 'approved',
    });

    if (loadingProfile) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {Array(5).fill(<StatCardSkeleton />)}
            </div>
        );
    }
    if (isErrorProfile) {
        return <p className="text-red-500 mb-8">Gagal memuat status: {errorProfile.message}</p>;
    }
    if (!profile) {
        return <p className="text-red-500 mb-8">Data profil tidak ditemukan.</p>;
    }

    // Jika status pending/rejected, semua stats 0
    const isNotApproved = profile.status?.toLowerCase() === 'pending' || profile.status?.toLowerCase() === 'rejected';

    if (isNotApproved) {
        // Data kartu dengan semua nilai 0
        const statCardsData = [
            { title: 'Total Event', value: 0, icon: <Calendar color="#3B82F6" />, color: '#3B82F6' },
            { title: 'Partisipan', value: 0, icon: <Users color="#10B981" />, color: '#10B981' },
            { title: 'Event Mendatang', value: 0, icon: <Clock color="#F59E0B" />, color: '#F59E0B' },
            { title: 'Event Selesai', value: 0, icon: <TrendingUp color="#EF4444" />, color: '#EF4444' },
            { title: 'Artikel', value: 0, icon: <FileText color="#14B8A6" />, color: '#14B8A6' },
        ];
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {statCardsData.map(stat => <StatCard key={stat.title} {...stat} />)}
            </div>
        );
    }

    if (loadingStats) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {Array(5).fill(<StatCardSkeleton />)}
            </div>
        );
    }
    if (isErrorStats) {
        return <p className="text-red-500 mb-8">Gagal memuat statistik: {errorStats.message}</p>;
    }
    if (!stats) {
        return <p className="text-red-500 mb-8">Data statistik tidak ditemukan.</p>;
    }

    // Data kartu yang dipetakan dari hasil API
    const statCardsData = [
        { title: 'Total Event', value: stats.totalEvents, icon: <Calendar color="#3B82F6" />, color: '#3B82F6' },
        { title: 'Partisipan', value: stats.totalParticipants, icon: <Users color="#10B981" />, color: '#10B981' },
        { title: 'Event Mendatang', value: stats.totalUpcomingEvents, icon: <Clock color="#F59E0B" />, color: '#F59E0B' },
        { title: 'Event Selesai', value: stats.totalCompletedEvents, icon: <TrendingUp color="#EF4444" />, color: '#EF4444' },
        { title: 'Artikel', value: stats.totalArticles, icon: <FileText color="#14B8A6" />, color: '#14B8A6' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCardsData.map(stat => <StatCard key={stat.title} {...stat} />)}
        </div>
    );
};

export default StatsGrid;
