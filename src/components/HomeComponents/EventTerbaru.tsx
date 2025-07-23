// src/components/HomeComponents/EventTerbaru.tsx

import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Contoh data untuk event, Anda bisa menggantinya dengan data dari API
const eventData = [
  {
    title: 'Aksi Bersih Sungai',
    location: 'Kramat Jati',
    date: '20 Juli 2025',
    participants: 45,
    imageUrl: '/slider1.png', // Ganti dengan gambar event yang sesuai
  },
  {
    title: 'Aksi Bersih Sungai',
    location: 'Kramat Jati',
    date: '20 Juli 2025',
    participants: 45,
    imageUrl: '/slider2.png',
  },
  {
    title: 'Aksi Bersih Sungai',
    location: 'Kramat Jati',
    date: '20 Juli 2025',
    participants: 45,
    imageUrl: '/slider3.png',
  },
];

const EventTerbaru: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3A53]">Event Terbaru</h2>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan event kebersihan lingkungan di sekitar Anda dan berpartisipasilah untuk masa depan yang lebih hijau
          </p>
        </div>

        {/* Grid for Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventData.map((event, index) => (
            <div key={index} className="border rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2">
              {/* Card Image and Badge */}
              <div className="relative">
                <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover" />
                <div className="absolute top-4 right-4 bg-[#79B829] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.participants} Peserta
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#1A3A53] mb-4">{event.title}</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{event.date}</span>
                  </div>
                </div>
                <button className="mt-6 w-full bg-[#1A3A53] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* "Lihat Semua" Button */}
        <div className="text-center mt-12">
          <Link to="/event">
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-[#79B829] text-[#79B829] font-semibold rounded-lg hover:bg-[#79B829] hover:text-white transition-colors">
              Lihat Semua Event
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default EventTerbaru;