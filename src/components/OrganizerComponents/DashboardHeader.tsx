// src/components/OrganizerComponents/DashboardHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Impor Link
import { Calendar, Plus } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A3A53]">Dashboard Organizer</h1>
        <div className="flex items-center gap-2 mt-1 text-gray-500">
          <Calendar size={16} />
          <span>Sejak 20 Juli 2025</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Ganti button menjadi Link dengan URL khusus dashboard */}
        <Link 
          to="/dashboard/artikel/create"
          className="flex items-center gap-2 bg-[#79B829] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90"
        >
          <Plus size={18} /> Tulis Artikel
        </Link>
        <Link 
          to="/dashboard/event/create"
          className="bg-[#1A3A53] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90"
        >
          Buat Event Baru
        </Link>
      </div>
    </div>
  );
};
export default DashboardHeader;