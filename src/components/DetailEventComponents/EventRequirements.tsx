import React from 'react';

const RequirementCard = ({ title, items }: { title: string; items: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-[#1A3A53] mb-4">{title}</h3>
    <p className="text-gray-700 whitespace-pre-line">{items}</p>
  </div>
);

const EventRequirements: React.FC<{ event: any }> = ({ event }) => {
  if (!event) return null;
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RequirementCard title="Yang Perlu Dibawa" items={event.requiredItems} />
        <RequirementCard title="Yang Disediakan" items={event.providedItems} />
      </div>
    </div>
  );
};
export default EventRequirements;