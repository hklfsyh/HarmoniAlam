// src/components/EventComponents/HeroSection.tsx

import React from 'react';
import { Plus } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative bg-cover bg-center text-white" 
      // Ganti 'hero-event-bg.png' dengan nama file gambar Anda di folder /public
      style={{ backgroundImage: "url('/hero-event-bg.png')" }}
    >
      {/* Overlay Gelap */}
      <div className="absolute inset-0  bg-opacity-40"></div>

      {/* Konten */}
      <div className="relative container mx-auto px-6 py-40 text-center">
        <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
          Event Kebersihan
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
          Temukan dan bergabung dengan event kebersihan lingkungan di seluruh dunia
        </p>
        <button className="mt-8 inline-flex items-center gap-2 bg-[#79B829] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1">
          <Plus className="h-5 w-5" />
          Buat Event Baru
        </button>
      </div>
    </section>
  );
};

export default HeroSection;