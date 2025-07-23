// src/components/DetailEventOrganizerComponents/DetailEventOrgTabs.tsx
import React from 'react';

const TABS = ['Overview', 'Partisipan', 'Analitik'];

interface DetailEventOrgTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DetailEventOrgTabs: React.FC<DetailEventOrgTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-slate-200 p-1 rounded-lg flex flex-col sm:flex-row gap-1 mb-6">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`w-full py-2 px-4 rounded-md font-semibold text-sm transition-all ${
            activeTab === tab ? 'bg-white shadow' : 'text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
export default DetailEventOrgTabs;