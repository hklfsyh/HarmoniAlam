// src/pages/DashboardAdminPage.tsx

import React, { useState } from 'react';
// Impor komponen dasar dasbor
import AdminHeader from '../components/AdminComponents/AdminHeader';
import AdminStatsGrid from '../components/AdminComponents/AdminStatsGrid';
import AdminTabs from '../components/AdminComponents/AdminTabs';

// Impor semua komponen konten TAB
import PengajuanOrganizerTab from '../components/AdminComponents/PengajuanOrganizerTab';
import VolunteersTab from '../components/AdminComponents/VolunteersTab';
import ArtikelTab from '../components/AdminComponents/ArtikelTab';
import OrganizersTab from '../components/AdminComponents/OrganizersTab';
import EventsTab from '../components/AdminComponents/EventsTab';

// Impor semua komponen untuk TAMPILAN DETAIL (in-page)
import DetailPengajuanView from '../components/AdminComponents/DetailPengajuanView';
import DetailVolunteerView from '../components/AdminComponents/DetailVolunteerView';
import AdminArticleDetailView from '../components/AdminComponents/AdminArticleDetailView';
import DetailOrganizerView from '../components/AdminComponents/DetailOrganizerView';

// Impor semua MODAL
import AdminEditArticleModal from '../components/AdminComponents/AdminEditArticleModal';

const DashboardAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pengajuan Organizer');
  const [viewingPengajuan, setViewingPengajuan] = useState(false);
  const [viewingVolunteer, setViewingVolunteer] = useState(false);
  const [viewingAdminArticle, setViewingAdminArticle] = useState(false);
  const [viewingOrganizer, setViewingOrganizer] = useState(false);
  const [isEditAdminArticleModalOpen, setIsEditAdminArticleModalOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewingPengajuan(false);
    setViewingVolunteer(false);
    setViewingAdminArticle(false);
    setViewingOrganizer(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Pengajuan Organizer':
        return viewingPengajuan 
          ? <DetailPengajuanView onBack={() => setViewingPengajuan(false)} /> 
          : <PengajuanOrganizerTab onViewClick={() => setViewingPengajuan(true)} />;
      
      case 'Volunteers':
        return viewingVolunteer 
          ? <DetailVolunteerView onBack={() => setViewingVolunteer(false)} /> 
          : <VolunteersTab onViewClick={() => setViewingVolunteer(true)} />;
      
      case 'Artikel':
        return viewingAdminArticle ? (
          <AdminArticleDetailView onBack={() => setViewingAdminArticle(false)} onEdit={() => setIsEditAdminArticleModalOpen(true)} />
        ) : (
          <ArtikelTab onViewClick={() => setViewingAdminArticle(true)} onEditClick={() => setIsEditAdminArticleModalOpen(true)} />
        );

      case 'Organizers':
        return viewingOrganizer
          ? <DetailOrganizerView onBack={() => setViewingOrganizer(false)} />
          : <OrganizersTab onViewClick={() => setViewingOrganizer(true)} />;

      case 'Event':
        return <EventsTab />;

      default:
        return <PengajuanOrganizerTab onViewClick={() => setViewingPengajuan(true)} />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <main className="container mx-auto px-6 py-8 mt-16">
        <AdminHeader />
        <AdminStatsGrid />
        <AdminTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <div>{renderContent()}</div>
      </main>
      
      <AdminEditArticleModal isOpen={isEditAdminArticleModalOpen} onClose={() => setIsEditAdminArticleModalOpen(false)} />
    </div>
  );
};

export default DashboardAdminPage;