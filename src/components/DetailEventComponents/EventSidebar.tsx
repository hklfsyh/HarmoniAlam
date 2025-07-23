// src/components/DetailEventComponents/EventSidebar.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const EventSidebar: React.FC = () => {
  const { user, requireLogin } = useAuth();

  const handleRegisterClick = () => {
    if (user) {
      // Di sini Anda bisa menambahkan logika pendaftaran event yang sesungguhnya
      alert('Anda berhasil mendaftar untuk event ini!');
    } else {
      requireLogin();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
      <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Bergabung dengan Event</h2>
      
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="font-semibold">Peserta Terdaftar</span>
          <span>45/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-[#79B829] h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
      </div>
      
      <button 
        onClick={handleRegisterClick}
        className="w-full bg-[#79B829] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all mb-6"
      >
        Daftar Event
      </button>

      <hr className="my-6"/>

      <div>
        <h3 className="text-xl font-bold text-[#1A3A53] mb-3">Lokasi Event</h3>
        <p className="text-gray-700">
          Pantai Ancol, Jakarta Utara<br/>
          Jl. Lodan Timur No.7, Ancol, Pademangan, Jakarta Utara, DKI Jakarta
        </p>
        <button className="w-full mt-4 border border-gray-300 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
          Lihat di Maps
        </button>
      </div>
    </div>
  );
};

export default EventSidebar;