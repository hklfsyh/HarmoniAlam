// src/components/HomeComponents/Ajakan.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Ajakan: React.FC = () => {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 text-center">

        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#1A3A53] leading-tight">
            Mulai Berkontribusi Hari Ini
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-4 sm:px-0">
            Setiap langkah kecil yang kita ambil hari ini akan berdampak besar untuk generasi mendatang
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-4 sm:px-0">
          <Link 
            to="/login"
            className="w-full sm:w-auto text-center bg-[#79B829] text-white font-normal text-base sm:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
          >
            Bergabung Bersama Kami
          </Link>
          <Link 
            to="/organizer/pengajuan"
            className="w-full sm:w-auto text-center bg-[#1A3A53] text-white font-normal text-base sm:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
          >
            Ajukan Jadi Organizer
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Ajakan;