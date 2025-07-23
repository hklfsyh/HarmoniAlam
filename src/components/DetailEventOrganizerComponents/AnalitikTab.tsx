// src/components/DetailEventOrganizerComponents/AnalitikTab.tsx
import React from 'react';

const AnalitikTab: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Statistik Pendaftaran</h2>
        <div className="text-center">
            <p className="text-7xl font-bold text-[#1A3A53]">45%</p>
            <p className="text-gray-600 mt-1">Kapasitas Terisi</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div className="bg-[#79B829] h-4 rounded-full" style={{ width: '45%' }}></div>
            </div>
        </div>
    </div>
);
export default AnalitikTab;