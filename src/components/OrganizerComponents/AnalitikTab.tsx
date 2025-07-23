// src/components/OrganizerComponents/AnalitikTab.tsx
import React from 'react';

const AnalitikTab: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Statistik Event</h2>
        <div className="space-y-2">
            <div className="flex justify-between"><span>Event Selesai</span><span>9</span></div>
            <div className="flex justify-between"><span>Event Akan Datang</span><span>3</span></div>
            <div className="flex justify-between"><span>Total Partisipan</span><span>847</span></div>
            <div className="flex justify-between"><span>Rata-rata Partisipan</span><span>71</span></div>
        </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Kategori Event</h2>
        <div className="space-y-2">
            <div className="flex justify-between"><span>Pembersihan</span><span>9</span></div>
            <div className="flex justify-between"><span>Penanaman</span><span>3</span></div>
            <div className="flex justify-between"><span>Edukasi</span><span>5</span></div>
        </div>
    </div>
  </div>
);
export default AnalitikTab;