// src/components/AdminComponents/AdminStatsGrid.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Users, UserCheck, FileText, Calendar } from 'lucide-react';
import adminApi from '../../API/admin';
// Tipe props untuk StatCard
type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactElement;
  color: string;
};

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

// Komponen untuk menampilkan placeholder saat data sedang dimuat
const StatCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
);

// Fungsi untuk mengambil data statistik dari API
const fetchAdminStats = async () => {
    const { data } = await adminApi.get('/admin/stats');
    return data;
};

const AdminStatsGrid: React.FC = () => {
    const { data: stats, isLoading, isError, error } = useQuery({
        queryKey: ['adminStats'],
        queryFn: fetchAdminStats,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {Array(5).fill(<StatCardSkeleton />)}
            </div>
        );
    }

    if (isError) {
        return <p className="text-red-500 mb-8">Gagal memuat statistik: {error.message}</p>;
    }

    // Data kartu yang akan ditampilkan, dipetakan dari hasil API
    const statCardsData = [
        { title: 'Pending', value: stats.pendingOrganizers, icon: <Clock stroke="#F59E0B" />, color: '#F59E0B' },
        { title: 'Volunteers', value: stats.totalVolunteers, icon: <Users stroke="#10B981" />, color: '#10B981' },
        { title: 'Organizers', value: stats.totalOrganizers, icon: <UserCheck stroke="#3B82F6" />, color: '#3B82F6' },
        { title: 'Total Article', value: stats.totalArticles, icon: <FileText stroke="#EF4444" />, color: '#EF4444' },
        { title: 'Total Event', value: stats.totalEvents, icon: <Calendar stroke="#14B8A6" />, color: '#14B8A6' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCardsData.map(stat => <StatCard key={stat.title} {...stat} />)}
        </div>
    );
};

export default AdminStatsGrid;