// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // 1. Impor Layout

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

const App: React.FC = () => {
  return (
    <>
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
          
          {/* Rute yang Dilindungi */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/artikel/create" element={<CreateArticlePage />} />
            
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
        </Route>
      </Routes>
      <LoginRequiredModal />
    </>
  );
};

export default App;