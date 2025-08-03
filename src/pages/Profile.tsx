import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProfileSidebar from '../components/ProfileComponents/ProfileSidebar';
import ProfileContent from '../components/ProfileComponents/ProfileContent';
import EditProfileModal from '../components/ProfileComponents/EditProfileModal';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import EditArticleModal from '../components/EditArticleModal';
import volunteerApi from '../API/volunteer';
import ConfirmationModal from '../components/ConfirmationModal';

// Fungsi API untuk menghapus artikel
const deleteArticle = (articleId: number) => {
    return volunteerApi.delete(`/articles/${articleId}`);
};

const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'event' | 'artikel'>('event');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<number | null>(null);

  const handleEditProfileSuccess = () => {
    setIsEditProfileModalOpen(false);
    setModalMessage("Informasi profil Anda telah berhasil disimpan.");
    setIsSuccessModalOpen(true);
  };

  const handleEditArticleSuccess = () => {
    setIsEditArticleModalOpen(false);
    setModalMessage("Artikel Anda telah berhasil diperbarui.");
    setIsSuccessModalOpen(true);
  };

  // Handler untuk menutup success modal dan refetch data
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    // Refetch semua data yang mungkin telah berubah
    queryClient.invalidateQueries({ queryKey: ['volunteerProfile'] });
    queryClient.invalidateQueries({ queryKey: ['myArticles'] });
    queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
    // Refetch detail artikel jika sedang dilihat
    queryClient.invalidateQueries({ queryKey: ['myArticleDetail'] });
  };

  // Handler untuk success dari ProfileContent (misalnya cancel registration)
  const handleProfileContentSuccess = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  // Handler untuk failure dari ProfileContent
  const handleProfileContentFailure = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  // Handler untuk menutup error modal dan refetch data
  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
    // Refetch data untuk memastikan konsistensi
    queryClient.invalidateQueries({ queryKey: ['volunteerProfile'] });
    queryClient.invalidateQueries({ queryKey: ['myArticles'] });
    queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
    // Refetch detail artikel jika sedang dilihat
    queryClient.invalidateQueries({ queryKey: ['myArticleDetail'] });
  };

  const handleFailure = (message: string) => {
    setIsEditProfileModalOpen(false);
    setIsEditArticleModalOpen(false);
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  const handleOpenEditArticle = (id: number) => {
      setSelectedArticleId(id);
      setIsEditArticleModalOpen(true);
  };

  const deleteMutation = useMutation({
      mutationFn: deleteArticle,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['myArticles'] });
          setIsDeleteModalOpen(false);
          setArticleToDeleteId(null);
          if (selectedArticleId) {
              setSelectedArticleId(null);
          }
          setModalMessage("Artikel berhasil dihapus.");
          setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
          setIsDeleteModalOpen(false);
          handleFailure(error.response?.data?.message || "Gagal menghapus artikel.");
      }
  });

  const handleOpenDeleteModal = (id: number) => {
      setArticleToDeleteId(id);
      setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
      if (articleToDeleteId) {
          deleteMutation.mutate(articleToDeleteId);
      }
  };

  return (
    <>
      <div className="bg-slate-50 min-h-screen">
        <main className="container mx-auto px-6 py-12 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfileSidebar onEditClick={() => setIsEditProfileModalOpen(true)} />
            </div>
            <div className="lg:col-span-3">
              <ProfileContent 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                onEditArticle={handleOpenEditArticle}
                onDeleteArticle={handleOpenDeleteModal}
                onSuccess={handleProfileContentSuccess}
                onFailure={handleProfileContentFailure}
              />
            </div>
          </div>
        </main>
      </div>

      <EditProfileModal 
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSuccess={handleEditProfileSuccess}
        onFailure={handleFailure}
      />

      <EditArticleModal
        isOpen={isEditArticleModalOpen}
        onClose={() => setIsEditArticleModalOpen(false)}
        articleId={selectedArticleId}
        onSuccess={handleEditArticleSuccess}
        api={volunteerApi}
        queryKeyToInvalidate="myArticles"
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
        onClose={handleErrorModalClose}
        title="Update Gagal"
        message={modalMessage}
        buttonText="Coba Lagi"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat diurungkan."
        isConfirming={deleteMutation.isPending}
      />
    </>
  );
};

export default ProfilePage;
