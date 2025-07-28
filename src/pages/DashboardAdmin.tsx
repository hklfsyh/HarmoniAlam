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
import SuccessModal from '../components/SuccessModal';
import ConfirmationModal from '../components/ConfirmationModal';
import RejectReasonModal from '../components/RejectReasonModal';
import DeleteReasonModal from '../components/DeleteReasonModal';
import SendEmailModal from '../components/SendEmailModal';
import EditArticleModal from '../components/EditArticleModal'

// Tipe data
interface User {
  volunteer_id?: number;
  organizer_id?: number;
  firstName?: string;
  lastName?: string;
  orgName?: string;
  email: string;
}

// Fungsi API
const deleteArticle = async ({ id, reason }: { id: number, reason: string }) => {
  const { data } = await adminApi.delete(`/articles/${id}`, { data: { reason } });
  return data;
};

const deleteVolunteer = async ({ id, reason }: { id: number, reason: string }) => {
  const { data } = await adminApi.delete(`/admin/users/volunteer/${id}`, { data: { reason } });
  return data;
};

const deleteOrganizer = async ({ id, reason }: { id: number, reason: string }) => {
  const { data } = await adminApi.delete(`/admin/users/organizer/${id}`, { data: { reason } });
  return data;
};

const deleteEvent = async ({ id, reason }: { id: number, reason: string }) => {
  const { data } = await adminApi.delete(`/events/${id}`, {
    data: { reason }
  });
  return data;
};

const updateSubmissionStatus = async ({ id, status, reason }: { id: number; status: 'approved' | 'rejected'; reason?: string }) => {
  const body: any = { status };
  if (reason) body.reason = reason;
  const { data } = await adminApi.patch(`/organizer/${id}/status`, body);
  return data;
};

const sendEmail = async ({ userId, userType, subject, message }: { userId: number, userType: string, subject: string, message: string }) => {
  const { data } = await adminApi.post('/admin/send-email', {
    userId, userType, subject, message
  });
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
  const [isEditAdminArticleModalOpen, setIsEditAdminArticleModalOpen] = useState(false);

  const [viewingOrganizer, setViewingOrganizer] = useState(false);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<number | null>(null);

  const [viewingEvent, setViewingEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isDeleteArticleModalOpen, setIsDeleteArticleModalOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<number | null>(null);

  const [isDeleteVolunteerModalOpen, setIsDeleteVolunteerModalOpen] = useState(false);
  const [volunteerToDeleteId, setVolunteerToDeleteId] = useState<number | null>(null);

  const [isDeleteOrgModalOpen, setIsDeleteOrgModalOpen] = useState(false);
  const [orgToDeleteId, setOrgToDeleteId] = useState<number | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [submissionToUpdateId, setSubmissionToUpdateId] = useState<number | null>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState<{ id: number, name: string, email: string, type: 'volunteer' | 'organizer' } | null>(null);

  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null);

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

  const handleOpenApproveModal = (id: number) => { setSubmissionToUpdateId(id); setIsApproveModalOpen(true); };
  const handleConfirmApprove = () => { if (submissionToUpdateId) statusUpdateMutation.mutate({ id: submissionToUpdateId, status: 'approved' }); };
  const handleOpenRejectModal = (id: number) => { setSubmissionToUpdateId(id); setIsRejectModalOpen(true); };
  const handleConfirmReject = (reason: string) => { if (submissionToUpdateId) statusUpdateMutation.mutate({ id: submissionToUpdateId, status: 'rejected', reason }); };

  const deleteArticleMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      setIsDeleteArticleModalOpen(false);
      setArticleToDeleteId(null);
      if (viewingAdminArticle) {
        setViewingAdminArticle(false);
        setSelectedArticleId(null);
      }
      setSuccessMessage("Artikel berhasil dihapus.");
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => { alert(`Gagal menghapus artikel: ${error.message}`); setIsDeleteArticleModalOpen(false); }
  });

  const deleteVolunteerMutation = useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      setIsDeleteVolunteerModalOpen(false);
      setVolunteerToDeleteId(null);
      setSuccessMessage("Akun volunteer berhasil dihapus.");
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => { alert(`Gagal menghapus volunteer: ${error.message}`); setIsDeleteVolunteerModalOpen(false); }
  });

  const deleteOrganizerMutation = useMutation({
    mutationFn: deleteOrganizer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizers'] });
      setIsDeleteOrgModalOpen(false);
      setOrgToDeleteId(null);
      setSuccessMessage("Akun organizer berhasil dihapus.");
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => { alert(`Gagal menghapus organizer: ${error.message}`); setIsDeleteOrgModalOpen(false); }
  });

  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
      setIsDeleteEventModalOpen(false);
      setEventToDeleteId(null);
      setSuccessMessage("Event berhasil dihapus.");
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      alert(`Gagal menghapus event: ${error.message}`);
      setIsDeleteEventModalOpen(false);
    }
  });

  const sendEmailMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      setIsSendEmailModalOpen(false);
      setSuccessMessage(`Email berhasil dikirim ke ${emailRecipient?.name}.`);
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      alert(`Gagal mengirim email: ${error.message}`);
    }
  });

  const handleOpenDeleteArticleModal = (id: number) => { setArticleToDeleteId(id); setIsDeleteArticleModalOpen(true); };
  const handleConfirmDeleteArticle = (reason: string) => { if (articleToDeleteId) deleteArticleMutation.mutate({ id: articleToDeleteId, reason }); };

  const handleOpenDeleteVolunteerModal = (id: number) => { setVolunteerToDeleteId(id); setIsDeleteVolunteerModalOpen(true); };
  const handleConfirmDeleteVolunteer = (reason: string) => { if (volunteerToDeleteId) deleteVolunteerMutation.mutate({ id: volunteerToDeleteId, reason }); };

  const handleOpenDeleteOrgModal = (id: number) => { setOrgToDeleteId(id); setIsDeleteOrgModalOpen(true); };
  const handleConfirmDeleteOrg = (reason: string) => { if (orgToDeleteId) deleteOrganizerMutation.mutate({ id: orgToDeleteId, reason }); };

  const handleOpenDeleteEventModal = (id: number) => {
    setEventToDeleteId(id);
    setIsDeleteEventModalOpen(true);
  };
  const handleConfirmDeleteEvent = (reason: string) => {
    if (eventToDeleteId) {
      deleteEventMutation.mutate({ id: eventToDeleteId, reason });
    }
  };

  const handleOpenSendEmailModal = (user: User, type: 'volunteer' | 'organizer') => {
    setEmailRecipient({
      id: user.volunteer_id || user.organizer_id,
      name: type === 'volunteer' ? `${user.firstName} ${user.lastName}` : user.orgName,
      email: user.email,
      type: type
    });
    setIsSendEmailModalOpen(true);
  };

  const handleConfirmSendEmail = (subject: string, message: string) => {
    if (emailRecipient) {
      sendEmailMutation.mutate({
        userId: emailRecipient.id,
        userType: emailRecipient.type,
        subject,
        message
      });
    }
  };

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
          <VolunteersTab onViewClick={(id) => { setSelectedVolunteerId(id); setViewingVolunteer(true); }} onDeleteClick={handleOpenDeleteVolunteerModal} onSendEmailClick={(v) => handleOpenSendEmailModal(v, 'volunteer')} />
        );
      case 'Artikel':
        return viewingAdminArticle && selectedArticleId ? (
          <AdminArticleDetailView articleId={selectedArticleId} onBack={() => { setViewingAdminArticle(false); setSelectedArticleId(null); }} onEdit={() => handleOpenEditArticleModal(selectedArticleId)} onDelete={() => handleOpenDeleteArticleModal(selectedArticleId)} />
        ) : (
          <ArtikelTab onViewClick={(id) => { setSelectedArticleId(id); setViewingAdminArticle(true); }} onEditClick={handleOpenEditArticleModal} onDeleteClick={handleOpenDeleteArticleModal} />
        );
      case 'Organizers':
        return viewingOrganizer && selectedOrganizerId ? (
          <DetailOrganizerView organizerId={selectedOrganizerId} onBack={() => { setViewingOrganizer(false); setSelectedOrganizerId(null); }} />
        ) : (
          <OrganizersTab onViewClick={(id) => { setSelectedOrganizerId(id); setViewingOrganizer(true); }} onSendEmailClick={(o) => handleOpenSendEmailModal(o, 'organizer')} onDeleteClick={handleOpenDeleteOrgModal} />
        );
      case 'Event':
        return viewingEvent && selectedEventId ? (
          <AdminDetailEventView eventId={selectedEventId} onBack={() => { setViewingEvent(false); setSelectedEventId(null); }} />
        ) : (
          <EventsTab
            onViewClick={(id) => { setSelectedEventId(id); setViewingEvent(true); }}
            onDeleteClick={handleOpenDeleteEventModal}
          />
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

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Berhasil!"
        message={successMessage}
        buttonText="Selesai"
      />

      <DeleteReasonModal
        isOpen={isDeleteArticleModalOpen}
        onClose={() => setIsDeleteArticleModalOpen(false)}
        onConfirm={handleConfirmDeleteArticle}
        isConfirming={deleteArticleMutation.isPending}
        title="Hapus Artikel"
        message="Tindakan ini akan menghapus artikel secara permanen. Harap berikan alasan penghapusan."
        confirmText="Ya, Hapus Artikel"
      />

      <DeleteReasonModal
        isOpen={isDeleteVolunteerModalOpen}
        onClose={() => setIsDeleteVolunteerModalOpen(false)}
        onConfirm={handleConfirmDeleteVolunteer}
        isConfirming={deleteVolunteerMutation.isPending}
        title="Hapus Akun Volunteer"
        message="Tindakan ini akan menghapus akun volunteer secara permanen. Harap berikan alasan penghapusan."
        confirmText="Ya, Hapus Volunteer"
      />

      <DeleteReasonModal
        isOpen={isDeleteOrgModalOpen}
        onClose={() => setIsDeleteOrgModalOpen(false)}
        onConfirm={handleConfirmDeleteOrg}
        isConfirming={deleteOrganizerMutation.isPending}
        title="Hapus Akun Organizer"
        message="Tindakan ini akan menghapus akun organizer dan semua event/artikel terkait secara permanen. Harap berikan alasan penghapusan."
        confirmText="Ya, Hapus Organizer"
      />

      <DeleteReasonModal
        isOpen={isDeleteEventModalOpen}
        onClose={() => setIsDeleteEventModalOpen(false)}
        onConfirm={handleConfirmDeleteEvent}
        isConfirming={deleteEventMutation.isPending}
        title="Hapus Event"
        message="Tindakan ini akan menghapus event secara permanen. Harap berikan alasan penghapusan."
        confirmText="Ya, Hapus Event"
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

      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        onConfirm={handleConfirmSendEmail}
        isSending={sendEmailMutation.isPending}
        recipientName={emailRecipient?.name || ''}
        recipientEmail={emailRecipient?.email || ''}
      />

      {/* Edit Article Modal (Reusable) */}
      <EditArticleModal
        isOpen={isEditAdminArticleModalOpen}
        onClose={() => setIsEditAdminArticleModalOpen(false)}
        articleId={selectedArticleId}
        onSuccess={handleEditSuccess}
        api={adminApi}
        queryKeyToInvalidate="allArticles"
      />
    </>
  );
};

export default DashboardAdminPage;
