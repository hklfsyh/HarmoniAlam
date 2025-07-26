import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../API/admin';

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

// Impor semua komponen untuk TAMPILAN DETAIL
import DetailPengajuanView from '../components/AdminComponents/DetailPengajuanView';
import DetailVolunteerView from '../components/AdminComponents/DetailVolunteerView';
import AdminArticleDetailView from '../components/AdminComponents/AdminArticleDetailView';
import DetailOrganizerView from '../components/AdminComponents/DetailOrganizerView';
import AdminDetailEventView from '../components/AdminComponents/AdminDetailEventView';

// Impor semua MODAL
import AdminEditArticleModal from '../components/AdminComponents/AdminEditArticleModal';
import SuccessModal from '../components/SuccessModal';
import ConfirmationModal from '../components/ConfirmationModal';
import RejectReasonModal from '../components/RejectReasonModal';

// Fungsi API
const deleteArticle = async (id: number) => {
  const { data } = await adminApi.delete(`/articles/${id}`);
  return data;
};

const updateSubmissionStatus = async ({ id, status, reason }: { id: number; status: 'approved' | 'rejected'; reason?: string }) => {
  const body: any = { status };
  if (reason) body.reason = reason;
  const { data } = await adminApi.patch(`/organizer/${id}/status`, body);
  return data;
};

const DashboardAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pengajuan Organizer');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [viewingPengajuan, setViewingPengajuan] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

  const [viewingVolunteer, setViewingVolunteer] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | null>(null);

  const [viewingAdminArticle, setViewingAdminArticle] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const [viewingOrganizer, setViewingOrganizer] = useState(false);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<number | null>(null);

  const [viewingEvent, setViewingEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [isEditAdminArticleModalOpen, setIsEditAdminArticleModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<number | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [submissionToUpdateId, setSubmissionToUpdateId] = useState<number | null>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewingPengajuan(false); setSelectedSubmissionId(null);
    setViewingVolunteer(false); setSelectedVolunteerId(null);
    setViewingAdminArticle(false); setSelectedArticleId(null);
    setViewingOrganizer(false); setSelectedOrganizerId(null);
    setViewingEvent(false); setSelectedEventId(null);
  };

  const handleOpenEditArticleModal = (id: number) => { setSelectedArticleId(id); setIsEditAdminArticleModalOpen(true); };
  const handleEditSuccess = () => { setIsEditAdminArticleModalOpen(false); setSuccessMessage("Data artikel telah berhasil diperbarui."); setIsSuccessModalOpen(true); };

  const statusUpdateMutation = useMutation({
    mutationFn: updateSubmissionStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizerSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['submissionDetail', variables.id] });
      setSuccessMessage(`Pengajuan telah berhasil di-${variables.status}.`);
      setIsSuccessModalOpen(true);
      setIsRejectModalOpen(false);
      setIsApproveModalOpen(false);
    },
    onError: (error: any) => { alert(`Gagal: ${error.message}`); }
  });

  const handleOpenApproveModal = (id: number) => {
    setSubmissionToUpdateId(id);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (submissionToUpdateId) {
      statusUpdateMutation.mutate({ id: submissionToUpdateId, status: 'approved' });
    }
  };

  const handleOpenRejectModal = (id: number) => { setSubmissionToUpdateId(id); setIsRejectModalOpen(true); };
  const handleConfirmReject = (reason: string) => { if (submissionToUpdateId) statusUpdateMutation.mutate({ id: submissionToUpdateId, status: 'rejected', reason }); };

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      setIsDeleteModalOpen(false);
      setArticleToDeleteId(null);
      if (viewingAdminArticle) {
        setViewingAdminArticle(false);
        setSelectedArticleId(null);
      }
      setSuccessMessage("Artikel berhasil dihapus.");
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      alert(`Gagal menghapus artikel: ${error.message}`);
      setIsDeleteModalOpen(false);
    }
  });

  const handleOpenDeleteModal = (id: number) => { setArticleToDeleteId(id); setIsDeleteModalOpen(true); };
  const handleConfirmDelete = () => { if (articleToDeleteId) deleteMutation.mutate(articleToDeleteId); };

  const renderContent = () => {
    switch (activeTab) {
      case 'Pengajuan Organizer':
        return viewingPengajuan && selectedSubmissionId ? (
          <DetailPengajuanView organizerId={selectedSubmissionId} onBack={() => { setViewingPengajuan(false); setSelectedSubmissionId(null); }} onApprove={handleOpenApproveModal} onReject={handleOpenRejectModal} />
        ) : (
          <PengajuanOrganizerTab onViewClick={(id) => { setSelectedSubmissionId(id); setViewingPengajuan(true); }} onApprove={handleOpenApproveModal} onReject={handleOpenRejectModal} />
        );
      case 'Volunteers':
        return viewingVolunteer && selectedVolunteerId ? (
          <DetailVolunteerView volunteerId={selectedVolunteerId} onBack={() => { setViewingVolunteer(false); setSelectedVolunteerId(null); }} />
        ) : (
          <VolunteersTab onViewClick={(id) => { setSelectedVolunteerId(id); setViewingVolunteer(true); }} />
        );
      case 'Artikel':
        return viewingAdminArticle && selectedArticleId ? (
          <AdminArticleDetailView articleId={selectedArticleId} onBack={() => { setViewingAdminArticle(false); setSelectedArticleId(null); }} onEdit={() => handleOpenEditArticleModal(selectedArticleId)} onDelete={() => handleOpenDeleteModal(selectedArticleId)} />
        ) : (
          <ArtikelTab onViewClick={(id) => { setSelectedArticleId(id); setViewingAdminArticle(true); }} onEditClick={handleOpenEditArticleModal} onDeleteClick={handleOpenDeleteModal} />
        );
      case 'Organizers':
        return viewingOrganizer && selectedOrganizerId ? (
          <DetailOrganizerView organizerId={selectedOrganizerId} onBack={() => { setViewingOrganizer(false); setSelectedOrganizerId(null); }} />
        ) : (
          <OrganizersTab onViewClick={(id) => { setSelectedOrganizerId(id); setViewingOrganizer(true); }} />
        );
      case 'Event':
        return viewingEvent && selectedEventId ? (
          <AdminDetailEventView eventId={selectedEventId} onBack={() => { setViewingEvent(false); setSelectedEventId(null); }} />
        ) : (
          <EventsTab onViewClick={(id) => { setSelectedEventId(id); setViewingEvent(true); }} />
        );
      default:
        return <PengajuanOrganizerTab onViewClick={(id) => { setSelectedSubmissionId(id); setViewingPengajuan(true); }} onApprove={handleOpenApproveModal} onReject={handleOpenRejectModal} />;
    }
  };

  return (
    <>
      <div className="bg-slate-100 min-h-screen">
        <main className="container mx-auto px-6 py-8 pt-30">
          <AdminHeader />
          <AdminStatsGrid />
          <AdminTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          <div>{renderContent()}</div>
        </main>
      </div>

      <AdminEditArticleModal
        isOpen={isEditAdminArticleModalOpen}
        onClose={() => {
          setIsEditAdminArticleModalOpen(false);
          setSelectedArticleId(null);
        }}
        articleId={selectedArticleId}
        onSuccess={handleEditSuccess}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Berhasil!"
        message={successMessage}
        buttonText="Selesai"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat diurungkan."
        isConfirming={deleteMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Konfirmasi Persetujuan"
        message="Apakah Anda yakin ingin menyetujui pengajuan organizer ini?"
        confirmText="Ya, Setujui"
        isConfirming={statusUpdateMutation.isPending}
      />

      <RejectReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleConfirmReject}
        isSubmitting={statusUpdateMutation.isPending}
      />
    </>
  );
};

export default DashboardAdminPage;
