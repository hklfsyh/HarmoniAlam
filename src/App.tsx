// src/App.tsx

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // 1. Impor Layout
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';

// Import semua halaman
import HomePage from './pages/Home';
import EventsPage from './pages/Event';
import DetailEventPage from './pages/DetailEvent';
import ArticlesPage from './pages/Articles';
import DetailArticlePage from './pages/DetailArticle';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PengajuanOrgPage from './pages/PengajuanOrg';
import CreateArticlePage from './pages/CreateArticle';
import ProfilePage from './pages/Profile';
import DashboardOrganizerPage from './pages/DashboardOrganizer';
import DetailEventOrganizerPage from './pages/DetailEventOrganizer';
import CreateEventPage from './pages/CreateEvent';
import DashboardAdminPage from './pages/DashboardAdmin';
import AdminDetailEventPage from './pages/AdminDetailEventPage';
import LoginRequiredModal from './components/LoginRequiredModal'; 
import ResetPasswordPage from './pages/ResetPasswordPage'; 
import NotFoundPage from './pages/NotFoundPage';
import OrganizerPublicProfilePage from './pages/OrganizerPublicProfile';
import BookmarkPage from './pages/BookmarkPage';


const App: React.FC = () => {
  const { user, resetIdleTimer } = useAuth();

  useEffect(() => {
    // Event listeners untuk reset idle timer pada aktivitas user
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleUserActivity = () => {
      if (user) {
        resetIdleTimer();
      }
    };

    // Tambahkan event listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Cleanup event listeners
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [user, resetIdleTimer]);

  return (
    <>
      <ScrollToTop /> {/* Tambahkan ini */}
      <Routes>
        {/* 2. Bungkus semua rute dengan Layout */}
        <Route element={<Layout />}>
          {/* Rute Publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/event" element={<EventsPage />} />
          <Route path="/event/detail/:eventId" element={<DetailEventPage />} />
          <Route path="/artikel" element={<ArticlesPage />} />
          <Route path="/artikel/detail/:articleId" element={<DetailArticlePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/organizer/pengajuan" element={<PengajuanOrgPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/organizer/public/:id" element={<OrganizerPublicProfilePage />} />
          
          {/* Rute yang Dilindungi */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/artikel/create" element={<CreateArticlePage />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            
            {/* Rute Organizer */}
            <Route path="/organizer" element={<DashboardOrganizerPage />} />
            <Route path="/dashboard/artikel/create" element={<CreateArticlePage />} />
            <Route path="/dashboard/event/detail" element={<DetailEventOrganizerPage />} />
            <Route path="/dashboard/event/create" element={<CreateEventPage />} />

            {/* Rute Admin */}
            <Route path="/admin" element={<DashboardAdminPage />} />
            <Route path="/admin/artikel/create" element={<CreateArticlePage />} />
            <Route path="/admin/event/detail" element={<AdminDetailEventPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <LoginRequiredModal />
    </>
  );
};

export default App;