// src/components/DetailEventComponents/EventRequirements.tsx
import React from 'react';

const RequirementCard = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-[#1A3A53] mb-4">{title}</h3>
    <ul className="list-disc pl-5 space-y-2 text-gray-700">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  </div>
);

const EventRequirements: React.FC = () => {
  const dibawaItems = [
    "Membawa botol minum sendiri",
    "Menggunakan pakaian yang nyaman",
    "Memakai sepatu yang sesuai untuk berjalan di pantai",
    "Membawa topi atau payung untuk melindungi dari sinar matahari",
  ];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RequirementCard title="Yang Perlu Dibawa" items={dibawaItems} />
        <RequirementCard title="Yang Disediakan" items={dibawaItems} />
      </div>
    </div>
  );
};

export default EventRequirements;