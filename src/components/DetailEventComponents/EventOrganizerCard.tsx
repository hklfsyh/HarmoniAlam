import React from 'react';

const OrganizerCard: React.FC<{ event: any }> = ({ event }) => {
  if (!event) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-normal text-[#1A3A53] mb-4">Diselenggarakan oleh</h3>
      <div className="flex items-center gap-4">
        <img 
          src={event.organizerProfilePicture} 
          alt={event.organizerName} 
          className="h-16 w-16 rounded-full object-cover" 
        />
        <div>
          <p className="font-normal text-[#1A3A53] text-lg">{event.organizerName}</p>
          {/* Anda bisa menambahkan link ke profil organizer di sini nanti */}
          <a href="#" className="text-sm font-light text-blue-600 hover:underline">Lihat Profil</a>
        </div>
      </div>
    </div>
  );
};

export default OrganizerCard;