// src/components/PengajuanOrgComponents/PengajuanHeader.tsx
import React from 'react';

const PengajuanHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A53]">
        Pengajuan Organizer
      </h1>
      <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
        Bergabunglah sebagai organizer dan mulai membuat event kebersihan lingkungan untuk komunitas Anda
      </p>
    </div>
  );
};

export default PengajuanHeader;