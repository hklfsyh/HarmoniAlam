// src/components/PengajuanOrgComponents/KeuntunganSection.tsx
import React from 'react';
import { ShieldCheck, CalendarPlus, LayoutDashboard, BarChart } from 'lucide-react';

const keuntunganData = [
  { icon: <ShieldCheck />, title: "Badge Terverifikasi", description: "Dapatkan badge organizer terverifikasi di profil Anda" },
  { icon: <CalendarPlus />, title: "Buat Event Tanpa Batas", description: "Tidak ada batasan jumlah event yang bisa dibuat" },
  { icon: <LayoutDashboard />, title: "Dashboard Organizer", description: "Akses ke dashboard khusus untuk mengelola event" },
  { icon: <BarChart />, title: "Laporan Detail", description: "Laporan partisipan dan statistik event yang detail" }
];

const KeuntunganSection: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1A3A53] mb-6">Keuntungan Menjadi Organizer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {keuntunganData.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="text-[#79B829] mt-1">
              {React.cloneElement(item.icon, { size: 28 })}
            </div>
            <div>
              <h3 className="font-semibold text-[#1A3A53]">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeuntunganSection;