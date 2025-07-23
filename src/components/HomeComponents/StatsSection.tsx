// src/components/HomeComponents/StatsSection.tsx

import React from 'react';
import { Users, CalendarCheck, TreePine } from 'lucide-react';

// Data untuk statistik
const statsData = [
  {
    // Ukuran ikon diubah dari h-16 w-16 menjadi h-12 w-12
    icon: <Users className="h-12 w-12 text-[#79B829]" />,
    value: '1,000+',
    label: 'Relawan Aktif',
  },
  {
    icon: <CalendarCheck className="h-12 w-12 text-[#79B829]" />,
    value: '50+',
    label: 'Aksi Selesai',
  },
  {
    icon: <TreePine className="h-12 w-12 text-[#79B829]" />,
    value: '2,000+',
    label: 'Pohon Ditanam',
  },
];

const StatsSection: React.FC = () => {
  return (
    // Padding vertikal diubah dari py-16 menjadi py-12
    <section className="bg-[#1A3A53] py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-4">
                {stat.icon}
              </div>
              {/* Ukuran teks angka diubah dari text-5xl menjadi text-4xl */}
              <p className="text-4xl font-bold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-lg text-[#79B829] font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;