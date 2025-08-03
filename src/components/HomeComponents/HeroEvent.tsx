// src/components/HomeComponents/HeroEvent.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroEvent: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 lg:py-32 xl:py-40">
      <div className="container mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-tight">
          <span className="text-[#1A3A53]">Bergabunglah dengan</span>
          <br />
          <span className="text-[#79B829]">Gerakan Aksi Lingkungan</span>
        </h2>

        {/* Sub-heading/Paragraph */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-3xl font-light px-4 sm:px-0 leading-relaxed">
          Terhubunglah dengan inisiatif lingkungan setempat, selenggarakan tindakan yang berdampak, dan jadilah bagian dari perubahan yang dibutuhkan planet kita.
        </p>

        {/* Call to Action Button */}
        <Link
          to="/event"
          className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#1A3A53] text-white font-normal rounded-lg shadow-lg transition-all duration-300 cursor-pointer hover:bg-[#79B829] text-sm sm:text-base w-full max-w-xs sm:max-w-none sm:w-auto"
        >
          <span>Temukan Event yang Anda Sukai</span>
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        </Link>

      </div>
    </section>
  );
};

export default HeroEvent;