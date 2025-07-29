// src/components/HomeComponents/Ajakan.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

const Ajakan: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 text-center">

        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-normal text-[#1A3A53]">
            Mulai Berkontribusi Hari Ini
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Setiap langkah kecil yang kita ambil hari ini akan berdampak besar untuk generasi mendatang
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {/* 2. Ganti tombol menjadi Link */}
          <Link 
            to="/login"
            className="text-center bg-[#79B829] text-white font-normal text-lg px-10 py-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
          >
            Bergabung Bersama Kami
          </Link>
          <Link 
            to="/organizer/pengajuan"
            className="text-center bg-[#1A3A53] text-white font-normal text-lg px-10 py-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
          >
            Ajukan Jadi Organizer
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Ajakan;