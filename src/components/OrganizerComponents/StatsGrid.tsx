// src/components/OrganizerComponents/StatsGrid.tsx
import React from 'react';
import { Calendar as CalendarIcon, Users, Clock, TrendingUp, FileText } from 'lucide-react';

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

const StatsGrid: React.FC = () => {
  const stats = [
    { title: 'Total Event', value: 12, icon: <CalendarIcon stroke="#3B82F6" />, color: '#3B82F6' },
    { title: 'Partisipan', value: 847, icon: <Users stroke="#10B981" />, color: '#10B981' },
    { title: 'Next event', value: 2, icon: <Clock stroke="#F59E0B" />, color: '#F59E0B' },
    { title: 'Event Selesai', value: 6, icon: <TrendingUp stroke="#EF4444" />, color: '#EF4444' },
    { title: 'Artikel', value: 6, icon: <FileText stroke="#14B8A6" />, color: '#14B8A6' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
    </div>
  );
};
export default StatsGrid;