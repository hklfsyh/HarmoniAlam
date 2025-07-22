// src/components/HomeComponents/HeroEvent.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react'; // Import ikon panah

const HeroEvent: React.FC = () => {
  return (
    // Section container dengan background abu-abu muda dan padding vertikal
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold">
          <span className="text-[#1A3A53]">Bergabunglah dengan</span>
          <br />
          <span className="text-[#79B829]">Gerakan Aksi Lingkungan</span>
        </h2>

        {/* Sub-heading/Paragraph */}
        <p className="mt-4 text-lg text-gray-600 max-w-3xl">
          Terhubunglah dengan inisiatif lingkungan setempat, selenggarakan tindakan yang berdampak, dan jadilah bagian dari perubahan yang dibutuhkan planet kita.
        </p>

        {/* Call to Action Button */}
        <button
          className="mt-8 flex items-center gap-3 px-8 py-4 bg-[#1A3A53] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 cursor-pointer hover:bg-[#79B829]"
        >
          Temukan Event yang Anda Sukai
          <ArrowRight className="h-5 w-5" />
        </button>

      </div>
    </section>
  );
};

export default HeroEvent;