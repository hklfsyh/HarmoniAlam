// src/components/OrganizerComponents/DashboardTabs.tsx
import React from 'react';

const TABS = ['Kelola Event', 'Total Artikel', 'Analitik', 'Profil Organizer'];

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
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

export default DashboardTabs;