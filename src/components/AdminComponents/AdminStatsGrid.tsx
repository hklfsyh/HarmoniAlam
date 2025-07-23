// src/components/AdminComponents/AdminStatsGrid.tsx
import React from 'react';
import { Clock, Users, UserCheck, FileText, Calendar } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
};

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

const AdminStatsGrid: React.FC = () => {
  const stats = [
    { title: 'Pending', value: 1, icon: <Clock stroke="#F59E0B" />, color: '#F59E0B' },
    { title: 'Volunteers', value: 3, icon: <Users stroke="#10B981" />, color: '#10B981' },
    { title: 'Organizers', value: 3, icon: <UserCheck stroke="#3B82F6" />, color: '#3B82F6' },
    { title: 'Total Article', value: 6, icon: <FileText stroke="#EF4444" />, color: '#EF4444' },
    { title: 'Total Event', value: 12, icon: <Calendar stroke="#14B8A6" />, color: '#14B8A6' }, // Card Baru
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
    </div>
  );
};
export default AdminStatsGrid;