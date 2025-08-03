import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from '../components/OrganizerComponents/DashboardHeader';
import StatsGrid from '../components/OrganizerComponents/StatsGrid';
import DashboardTabs from '../components/OrganizerComponents/DashboardTabs';
import KelolaEventTab from '../components/OrganizerComponents/KelolaEventTab';
import TotalArtikelTab from '../components/OrganizerComponents/TotalArtikelTab';
import AnalitikTab from '../components/OrganizerComponents/AnalitikTab';
import ProfilOrganizerTab from '../components/OrganizerComponents/ProfilOrganizerTab';
import DetailEventView from '../components/OrganizerComponents/DetailEventView';
import ViewArticleDetail from '../components/OrganizerComponents/ViewArticleDetail';
import EditArticleModal from '../components/EditArticleModal';
import SuccessModal from '../components/SuccessModal';
import organizerApi from '../API/organizer';
import EditEventModal from '../components/OrganizerComponents/EditEventModal';
import ConfirmationModal from '../components/ConfirmationModal';
import EditOrganizerProfileModal from '../components/OrganizerComponents/EditOrganizerProfileModal';
import ErrorModal from '../components/ErrorModal';
import ContactAdminModal from '../components/ContactAdminModal';

// Fungsi API untuk menghapus event
const deleteEvent = (eventId: number) => {
    return organizerApi.delete(`/events/${eventId}`);
};

// Fungsi API untuk menghapus artikel
const deleteArticle = (articleId: number) => {
    return organizerApi.delete(`/articles/${articleId}`);
};

// Fungsi API untuk mengirim email kontak
const contactAdmin = async ({ subject, message }: { subject: string, message: string }) => {
    const { data } = await organizerApi.post('/contact', { subject, message });
    return data;
};

const DashboardOrganizerPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Kelola Event');
  
  const [viewingEvent, setViewingEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  
  const [viewingArticle, setViewingArticle] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null);
  
  const [isDeleteArticleModalOpen, setIsDeleteArticleModalOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<number | null>(null);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewingEvent(false);
    setSelectedEventId(null);
    setViewingArticle(false);
    setSelectedArticleId(null);
  };

  const handleOpenEditArticleModal = (id: number) => {
    setSelectedArticleId(id);
    setIsEditArticleModalOpen(true);
  };

  const handleOpenEditEventModal = (id: number) => {
    setSelectedEventId(id);
    setIsEditEventModalOpen(true);
  };
  
  const handleOpenEditOrgModal = () => {
    setIsEditOrgModalOpen(true);
  };

  const handleEditSuccess = (message: string) => {
    setIsEditArticleModalOpen(false);
    setIsEditEventModalOpen(false);
    setIsEditOrgModalOpen(false);
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const handlePermissionDenied = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  const deleteMutation = useMutation({
      mutationFn: deleteEvent,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['myEvents'] });
          setIsDeleteEventModalOpen(false);
          setEventToDeleteId(null);
          if (viewingEvent) {
              setViewingEvent(false);
              setSelectedEventId(null);
          }
          setModalMessage("Event berhasil dihapus.");
          setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
          setModalMessage(error.response?.data?.message || "Gagal menghapus event.");
          setIsErrorModalOpen(true);
          setIsDeleteEventModalOpen(false);
      }
  });

  const deleteArticleMutation = useMutation({
      mutationFn: deleteArticle,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['myArticles'] });
          setIsDeleteArticleModalOpen(false);
          setArticleToDeleteId(null);
          if (viewingArticle) {
              setViewingArticle(false);
              setSelectedArticleId(null);
          }
          setModalMessage("Artikel berhasil dihapus.");
          setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
          setModalMessage(error.response?.data?.message || "Gagal menghapus artikel.");
          setIsErrorModalOpen(true);
          setIsDeleteArticleModalOpen(false);
      }
  });
  
  const contactMutation = useMutation({
      mutationFn: contactAdmin,
      onSuccess: () => {
          setIsContactModalOpen(false);
          setModalMessage("Pesan Anda telah berhasil dikirim ke admin.");
          setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
          setModalMessage(error.response?.data?.message || "Gagal mengirim pesan.");
          setIsErrorModalOpen(true);
      }
  });

  const handleOpenDeleteEventModal = (id: number) => {
      setEventToDeleteId(id);
      setIsDeleteEventModalOpen(true);
  };

  const handleConfirmDeleteEvent = () => {
      if (eventToDeleteId) {
          deleteMutation.mutate(eventToDeleteId);
      }
  };

  const handleOpenDeleteArticleModal = (id: number) => {
      setArticleToDeleteId(id);
      setIsDeleteArticleModalOpen(true);
  };

  const handleConfirmDeleteArticle = () => {
      if (articleToDeleteId) {
          deleteArticleMutation.mutate(articleToDeleteId);
      }
  };

  const handleOpenContactModal = () => {
      setIsContactModalOpen(true);
  };

  const handleConfirmContact = (subject: string, message: string) => {
      contactMutation.mutate({ subject, message });
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
            onEdit={handleOpenEditEventModal}
            onDelete={handleOpenDeleteEventModal}
          />
        ) : (
          <KelolaEventTab 
            onViewClick={(id) => {
              setSelectedEventId(id);
              setViewingEvent(true);
            }}
            onEditClick={handleOpenEditEventModal}
            onDeleteClick={handleOpenDeleteEventModal}
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
                onEdit={() => handleOpenEditArticleModal(selectedArticleId)}
            />
        ) : (
            <TotalArtikelTab 
                onViewClick={(id) => {
                    setSelectedArticleId(id);
                    setViewingArticle(true);
                }}
                onEditClick={handleOpenEditArticleModal}
                onDeleteClick={handleOpenDeleteArticleModal}
            />
        );
      case 'Analitik':
        return <AnalitikTab />;
      case 'Profil Organizer':
        return <ProfilOrganizerTab onEditClick={handleOpenEditOrgModal} />;
      default:
        return <KelolaEventTab onViewClick={() => {}} onEditClick={() => {}} onDeleteClick={() => {}} />;
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    // Refetch semua data yang relevan
    queryClient.invalidateQueries({ queryKey: ['myEvents'] });
    queryClient.invalidateQueries({ queryKey: ['myArticles'] });
    queryClient.invalidateQueries({ queryKey: ['organizerProfile'] });
    queryClient.invalidateQueries({ queryKey: ['organizerProfileForTotalArtikel'] });
    queryClient.invalidateQueries({ queryKey: ['organizerStats'] });
    queryClient.invalidateQueries({ queryKey: ['eventStats'] });
    queryClient.invalidateQueries({ queryKey: ['articleStats'] });
};

  return (
    <>
      <div className="bg-slate-100 min-h-screen">
        <main className="container mx-auto px-6 py-8 pt-30">
          <DashboardHeader 
            onPermissionDenied={handlePermissionDenied}
            onContactAdminClick={handleOpenContactModal}
          />
          <StatsGrid />
          <DashboardTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          <div>{renderContent()}</div>
        </main>
      </div>

      <EditArticleModal 
        isOpen={isEditArticleModalOpen}
        onClose={() => setIsEditArticleModalOpen(false)}
        articleId={selectedArticleId}
        onSuccess={() => handleEditSuccess('Artikel')}
        api={organizerApi}
        queryKeyToInvalidate="myArticles"
      />

      <EditEventModal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        eventId={selectedEventId}
        onSuccess={() => handleEditSuccess('Event')}
      />
      
      <EditOrganizerProfileModal
        isOpen={isEditOrgModalOpen}
        onClose={() => setIsEditOrgModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Berhasil!"
        message={modalMessage}
        buttonText="Selesai"
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Terjadi Kesalahan"
        message={modalMessage}
        buttonText="Saya Mengerti"
      />

      <ConfirmationModal
        isOpen={isDeleteEventModalOpen}
        onClose={() => setIsDeleteEventModalOpen(false)}
        onConfirm={handleConfirmDeleteEvent}
        title="Konfirmasi Hapus Event"
        message="Apakah Anda yakin ingin menghapus event ini? Semua data pendaftaran terkait akan hilang."
        isConfirming={deleteMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isDeleteArticleModalOpen}
        onClose={() => setIsDeleteArticleModalOpen(false)}
        onConfirm={handleConfirmDeleteArticle}
        title="Konfirmasi Hapus Artikel"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat diurungkan."
        isConfirming={deleteArticleMutation.isPending}
      />

      <ContactAdminModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onConfirm={handleConfirmContact}
        isSending={contactMutation.isPending}
      />
    </>
  );
};
export default DashboardOrganizerPage;
