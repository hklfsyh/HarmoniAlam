// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import ProfileSidebar from '../components/ProfileComponents/ProfileSidebar';
import ProfileContent from '../components/ProfileComponents/ProfileContent';
import EditProfileModal from '../components/ProfileComponents/EditProfileModal';
import EditArticleModal from '../components/ProfileComponents/EditArticleModal'; // 1. Impor modal baru

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'event' | 'artikel'>('artikel');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingArticle, setViewingArticle] = useState(false);
  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false); // 2. State baru untuk modal edit artikel

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="container mx-auto px-6 py-12 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar onEditClick={() => setIsModalOpen(true)} />
          </div>
          <div className="lg:col-span-3">
            <ProfileContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              viewingArticle={viewingArticle}
              setViewingArticle={setViewingArticle}
              onEditArticle={() => setIsEditArticleModalOpen(true)} // 3. Kirim fungsi untuk membuka modal
            />
          </div>
        </div>
      </main>
      <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* 4. Render modal edit artikel secara kondisional */}
      <EditArticleModal isOpen={isEditArticleModalOpen} onClose={() => setIsEditArticleModalOpen(false)} />
    </div>
  );
};

export default ProfilePage;