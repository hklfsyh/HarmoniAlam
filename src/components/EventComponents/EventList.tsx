// src/components/EventComponents/EventList.tsx

import React from 'react';
import EventCard from './EventCard';

// Contoh data, nantinya bisa dari API
const eventsData = [
  {
    title: 'Bersih Pantai Ancol',
    description: 'Bergabunglah dengan kami untuk aksi bersih sungai komunitas demi memulihkan sungai lokal',
    date: '20 Juli 2025 - 09:00 WIB',
    organizer: 'EcoJakarrta',
    participants: { current: 45, max: 100 },
    imageUrl: '/imageTemplateEvent.png', // Ganti dengan gambar yang sesuai
  },
  {
    title: 'Bersih Pantai Ancol',
    description: 'Bergabunglah dengan kami untuk aksi bersih sungai komunitas demi memulihkan sungai lokal',
    date: '20 Juli 2025 - 09:00 WIB',
    organizer: 'EcoJakarrta',
    participants: { current: 45, max: 100 },
    imageUrl: '/imageTemplateEvent.png',
  },
  {
    title: 'Bersih Pantai Ancol',
    description: 'Bergabunglah dengan kami untuk aksi bersih sungai komunitas demi memulihkan sungai lokal',
    date: '20 Juli 2025 - 09:00 WIB',
    organizer: 'EcoJakarrta',
    participants: { current: 45, max: 100 },
    imageUrl: '/imageTemplateEvent.png',
  },
  {
    title: 'Bersih Pantai Ancol',
    description: 'Bergabunglah dengan kami untuk aksi bersih sungai komunitas demi memulihkan sungai lokal',
    date: '20 Juli 2025 - 09:00 WIB',
    organizer: 'EcoJakarrta',
    participants: { current: 45, max: 100 },
    imageUrl: '/imageTemplateEvent.png',
  },
    {
    title: 'Bersih Pantai Ancol',
    description: 'Bergabunglah dengan kami untuk aksi bersih sungai komunitas demi memulihkan sungai lokal',
    date: '20 Juli 2025 - 09:00 WIB',
    organizer: 'EcoJakarrta',
    participants: { current: 45, max: 100 },
    imageUrl: '/imageTemplateEvent.png',
  },
    {
    title: 'Bersih Pantai Ancol',
    description: 'Bergabunglah dengan kami untuk aksi bersih sungai komunitas demi memulihkan sungai lokal',
    date: '20 Juli 2025 - 09:00 WIB',
    organizer: 'EcoJakarrta',
    participants: { current: 45, max: 100 },
    imageUrl: '/imageTemplateEvent.png',
  },
];

const EventList: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-[#1A3A53] mb-10">Daftar Event Mendatang</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventsData.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;