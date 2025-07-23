// src/pages/DashboardOrganizerPage.tsx

import React, { useState } from 'react';

// Impor semua komponen dasbor
import DashboardHeader from '../components/OrganizerComponents/DashboardHeader';
import StatsGrid from '../components/OrganizerComponents/StatsGrid';
import DashboardTabs from '../components/OrganizerComponents/DashboardTabs';

// Impor semua komponen konten tab
import KelolaEventTab from '../components/OrganizerComponents/KelolaEventTab';
import TotalArtikelTab from '../components/OrganizerComponents/TotalArtikelTab';
import AnalitikTab from '../components/OrganizerComponents/AnalitikTab';
import ProfilOrganizerTab from '../components/OrganizerComponents/ProfilOrganizerTab';

// Impor komponen detail dan semua modal
import ViewArticleDetail from '../components/OrganizerComponents/ViewArticleDetail';
import EditOrganizerProfileModal from '../components/OrganizerComponents/EditOrganizerProfileModal';
import EditArticleModal from '../components/OrganizerComponents/EditArticleModal';
import EditEventModal from '../components/OrganizerComponents/EditEventModal';

const DashboardOrganizerPage: React.FC = () => {
  // State untuk mengelola tab yang aktif
  const [activeTab, setActiveTab] = useState('Kelola Event');
  
  // State untuk mengelola semua modal
  const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  
  // State untuk menampilkan detail artikel di dalam tab
  const [viewingArticleDetail, setViewingArticleDetail] = useState(false);

  // Fungsi untuk merender konten berdasarkan tab yang aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'Kelola Event':
        return <KelolaEventTab onEditClick={() => setIsEditEventModalOpen(true)} />;
      
      case 'Total Artikel':
        return viewingArticleDetail ? (
          <ViewArticleDetail onBack={() => setViewingArticleDetail(false)} />
        ) : (
          <TotalArtikelTab 
            onViewClick={() => setViewingArticleDetail(true)} 
            onEditClick={() => setIsEditArticleModalOpen(true)}
          />
        );
      
      case 'Analitik':
        return <AnalitikTab />;
      
      case 'Profil Organizer':
        return <ProfilOrganizerTab onEditClick={() => setIsEditOrgModalOpen(true)} />;
      
      default:
        return <KelolaEventTab onEditClick={() => setIsEditEventModalOpen(true)} />;
    }
  };

  // Handler untuk mengganti tab, sekaligus mereset state tampilan detail
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewingArticleDetail(false); 
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <main className="container mx-auto px-6 py-8 mt-16">
        <DashboardHeader />
        <StatsGrid />
        <DashboardTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <div>
          {renderContent()}
        </div>
      </main>
      
      {/* Render semua modal di sini, tampilannya dikelola oleh state masing-masing */}
      <EditOrganizerProfileModal 
        isOpen={isEditOrgModalOpen} 
        onClose={() => setIsEditOrgModalOpen(false)} 
      />
      <EditArticleModal 
        isOpen={isEditArticleModalOpen} 
        onClose={() => setIsEditArticleModalOpen(false)} 
      />
      <EditEventModal 
        isOpen={isEditEventModalOpen} 
        onClose={() => setIsEditEventModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardOrganizerPage;