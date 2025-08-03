// src/components/HomeComponents/StatsSection.tsx

import React from 'react';
import { Users, CalendarCheck, TreePine } from 'lucide-react';

// Data untuk statistik
const statsData = [
  {
    icon: <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-[#79B829]" />,
    value: '1,000+',
    label: 'Relawan Aktif',
  },
  {
    icon: <CalendarCheck className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-[#79B829]" />,
    value: '50+',
    label: 'Aksi Selesai',
  },
  {
    icon: <TreePine className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-[#79B829]" />,
    value: '2,000+',
    label: 'Pohon Ditanam',
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className="bg-[#1A3A53] py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-12 text-center">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-3 sm:mb-4">
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white">
                {stat.value}
              </p>
              <p className="mt-1 sm:mt-2 text-base sm:text-lg text-[#79B829] font-light">
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