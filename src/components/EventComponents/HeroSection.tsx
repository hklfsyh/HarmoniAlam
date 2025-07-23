// src/components/EventComponents/HeroSection.tsx

import React from 'react';

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
      </div>
    </section>
  );
};

export default HeroSection;