// src/components/EventComponents/FilterEvent.tsx

import React from 'react';
import { Search } from 'lucide-react';

const FilterEvent: React.FC = () => {
  return (
    <section className="bg-slate-50 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari Aksi...."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#79B829] focus:border-transparent outline-none transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex w-full md:w-auto items-center gap-4">
            <select className="w-full md:w-auto border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#79B829] focus:border-transparent outline-none transition">
              <option>Semua Aksi</option>
              <option>Pembersihan Sungai</option>
              <option>Penanaman Pohon</option>
              <option>Edukasi Lingkungan</option>
            </select>

            <select className="w-full md:w-auto border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#79B829] focus:border-transparent outline-none transition">
              <option>Semua Tanggal</option>
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
              <option>Akan Datang</option>
            </select>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FilterEvent;