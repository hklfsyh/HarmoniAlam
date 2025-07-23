// src/components/DetailEventComponents/EventHeader.tsx
import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventHeader: React.FC = () => {
  return (
    <div>
      <Link to="/event" className="inline-flex items-center gap-2 text-[#1A3A53] font-semibold mb-6 hover:underline">
        <ArrowLeft className="h-5 w-5" />
        Kembali ke Event
      </Link>
      <div className="relative mb-6">
        <img src="/imageTemplateEvent.png" alt="Bersih Pantai Ancol" className="w-full h-[400px] object-cover rounded-lg" />
        <div className="absolute top-4 right-4 bg-[#79B829] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
          45/100 Peserta
        </div>
      </div>
      <h1 className="text-4xl font-bold text-[#1A3A53] mb-4">Bersih Pantai Ancol</h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
        <div className="flex items-center gap-2"><Calendar className="h-5 w-5" /><span>20 Juli 2025</span></div>
        <div className="flex items-center gap-2"><Clock className="h-5 w-5" /><span>07:00-12:00 WIB</span></div>
        <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /><span>Pantai Ancol, Jakarta Utara</span></div>
      </div>
    </div>
  );
};

export default EventHeader;