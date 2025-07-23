// src/pages/DetailEventOrganizerPage.tsx
import React, { useState } from 'react';
import DetailEventOrgHeader from '../components/DetailEventOrganizerComponents/DetailEventOrgHeader';
import DetailEventOrgTabs from '../components/DetailEventOrganizerComponents/DetailEventOrgTabs';
import OverviewTab from '../components/DetailEventOrganizerComponents/OverviewTab';
import PartisipanTab from '../components/DetailEventOrganizerComponents/PartisipanTab';
import AnalitikTab from '../components/DetailEventOrganizerComponents/AnalitikTab';

const DetailEventOrganizerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Analitik');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab />;
      case 'Partisipan':
        return <PartisipanTab />;
      case 'Analitik':
        return <AnalitikTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <main className="container mx-auto px-6 py-8 mt-16">
        <DetailEventOrgHeader />
        <DetailEventOrgTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>{renderContent()}</div>
      </main>
    </div>
  );
};
export default DetailEventOrganizerPage;