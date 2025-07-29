import React from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react"; // Impor ikon User

const formatTime = (isoString: string) =>
  new Date(isoString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const EventHeader: React.FC<{ event: any }> = ({ event }) => {
  if (!event) return null;
  return (
    <div>
      <div className="relative mb-6">
        <img
          src={event.imagePath}
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
        <div className="absolute top-4 right-4 bg-white/90 text-[#1A3A53] px-4 py-2 rounded-lg text-sm font-normal shadow-md">
          {event.currentParticipants}/{event.maxParticipants} Peserta
        </div>
      </div>
      <h1 className="text-4xl font-normal text-[#1A3A53] mb-4">
        {event.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 font-light">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>{new Date(event.eventDate).toLocaleDateString("id-ID")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>{formatTime(event.eventTime)} WIB</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
        {/* Tambahan: Menampilkan nama organizer */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-5 w-5 text-gray-500" />
          <span className="font-light">{event.organizerName}</span>
        </div>
      </div>
    </div>
  );
};
export default EventHeader;
