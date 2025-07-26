import React, { useState } from 'react';
import ProfileSidebar from '../components/ProfileComponents/ProfileSidebar';
import ProfileContent from '../components/ProfileComponents/ProfileContent';
import EditProfileModal from '../components/ProfileComponents/EditProfileModal';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import MyArticleEditModal from '../components/ProfileComponents/EditArticleModal';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'event' | 'artikel'>('event');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

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

      <MyArticleEditModal
        isOpen={isEditArticleModalOpen}
        onClose={() => setIsEditArticleModalOpen(false)}
        articleId={selectedArticleId}
        onSuccess={handleEditArticleSuccess}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Berhasil!"
        message={modalMessage}
        buttonText="Selesai"
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Update Gagal"
        message={modalMessage}
        buttonText="Coba Lagi"
      />
    </>
  );
};

export default ProfilePage;
