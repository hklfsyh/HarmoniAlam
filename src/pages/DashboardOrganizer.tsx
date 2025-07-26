import React, { useState } from 'react';
import DashboardHeader from '../components/OrganizerComponents/DashboardHeader';
import StatsGrid from '../components/OrganizerComponents/StatsGrid';
import DashboardTabs from '../components/OrganizerComponents/DashboardTabs';
import KelolaEventTab from '../components/OrganizerComponents/KelolaEventTab';
import TotalArtikelTab from '../components/OrganizerComponents/TotalArtikelTab';
import AnalitikTab from '../components/OrganizerComponents/AnalitikTab';
import ProfilOrganizerTab from '../components/OrganizerComponents/ProfilOrganizerTab';
import DetailEventView from '../components/OrganizerComponents/DetailEventView';
import ViewArticleDetail from '../components/OrganizerComponents/ViewArticleDetail';

const DashboardOrganizerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Kelola Event');

  const [viewingEvent, setViewingEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [viewingArticle, setViewingArticle] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewingEvent(false);
    setSelectedEventId(null);
    setViewingArticle(false);
    setSelectedArticleId(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Kelola Event':
        return viewingEvent && selectedEventId ? (
          <DetailEventView
            eventId={selectedEventId}
            onBack={() => {
              setViewingEvent(false);
              setSelectedEventId(null);
            }}
          />
        ) : (
          <KelolaEventTab
            onViewClick={(id) => {
              setSelectedEventId(id);
              setViewingEvent(true);
            }}
          />
        );
      case 'Total Artikel':
        return viewingArticle && selectedArticleId ? (
          <ViewArticleDetail
            articleId={selectedArticleId}
            onBack={() => {
              setViewingArticle(false);
              setSelectedArticleId(null);
            }}
            onEdit={() => { /* Logika untuk modal edit artikel organizer */ }}
          />
        ) : (
          <TotalArtikelTab
            onViewClick={(id) => {
              setSelectedArticleId(id);
              setViewingArticle(true);
            }}
          />
        );
      case 'Analitik':
        return <AnalitikTab />;
      case 'Profil Organizer':
        return <ProfilOrganizerTab onEditClick={() => { /* Logika untuk modal edit profil organizer */ }} />;
      default:
        return <KelolaEventTab onViewClick={() => { }} />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <main className="container mx-auto px-6 py-8 pt-30">
        <DashboardHeader />
        <StatsGrid />
        <DashboardTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <div>{renderContent()}</div>
      </main>
    </div>
  );
};
export default DashboardOrganizerPage;
