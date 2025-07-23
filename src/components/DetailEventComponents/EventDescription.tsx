// src/components/DetailEventComponents/EventDescription.tsx
import React from 'react';

const EventDescription: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Deskripsi Event</h2>
      <div className="text-gray-700 leading-relaxed space-y-4">
        <p>
          Mari bergabung dalam aksi bersih pantai Ancol untuk menjaga kebersihan dan kelestarian ekosistem laut. Event ini akan meliputi:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Pembersihan sampah di sepanjang garis pantai</li>
          <li>Edukasi tentang dampak sampah terhadap kehidupan laut</li>
          <li>Penanaman tanaman pantai untuk mencegah erosi</li>
          <li>Sesi foto bersama dan networking</li>
        </ul>
        <p>
          Kami akan menyediakan peralatan kebersihan, sarung tangan, dan konsumsi ringan. Peserta diharapkan membawa botol minum sendiri untuk mengurangi sampah plastik.
        </p>
        <p>
          Event ini sangat cocok untuk keluarga dan semua kalangan. Mari bersama-sama menjaga pantai Ancol tetap bersih dan indah!
        </p>
      </div>
    </div>
  );
};

export default EventDescription;