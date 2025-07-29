import React from 'react';

const EventDescription: React.FC<{ event: any }> = ({ event }) => {
  if (!event) return null;
  return (
    <div className="bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-normal text-[#1A3A53] mb-4">Deskripsi Event</h2>
      <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line font-light">
        {event.description}
      </div>
    </div>
  );
};
export default EventDescription;