// src/components/EventComponents/EventCard.tsx

import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom'; // 1. Import Link

// Tentukan tipe data untuk sebuah event
interface Event {
  title: string;
  description: string;
  date: string;
  organizer: string;
  participants: {
    current: number;
    max: number;
  };
  imageUrl: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Image and Badge */}
      <div className="relative">
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 left-3 bg-[#79B829] bg-opacity-90 text-white px-3 py-1 rounded-md text-sm font-semibold border-2 border-white/50">
          {event.participants.current}/{event.participants.max}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#1A3A53] mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{event.description}</p>
        
        {/* Meta Info */}
        <div className="space-y-3 mb-6 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>Organizers: {event.organizer}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {/* 2. Ganti <button> dengan <Link> */}
          <Link 
            to="/event/detail" 
            className="flex-1 text-center bg-[#1A3A53] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Lihat Detail
          </Link>
          <button className="flex-1 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;