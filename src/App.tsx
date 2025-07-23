// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import komponen utama
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import halaman-halaman Anda
import HomePage from './pages/Home';
import EventsPage from './pages/Event';
import DetailEventPage from './pages/DetailEvent';
import ArticlesPage from './pages/Articles';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PengajuanOrgPage from './pages/PengajuanOrg';
import CreateArticlePage from './pages/CreateArticle';
import ProfilePage from './pages/Profile';
import DetailArticlePage from './pages/DetailArticle';
import DashboardOrganizerPage from './pages/DashboardOrganizer';
import DetailEventOrganizerPage from './pages/DetailEventOrganizer';
import CreateEventPage from './pages/CreateEvent';
import DashboardAdminPage from './pages/DashboardAdmin';
import AdminDetailEventPage from './pages/AdminDetailEventPage';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes> {/* Routes akan memilih komponen mana yang akan dirender */}
          <Route path="/" element={<HomePage />} />
          <Route path="/event" element={<EventsPage />} />
          <Route path="/event/detail" element={<DetailEventPage />} />
          <Route path="/artikel" element={<ArticlesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/organizer/pengajuan" element={<PengajuanOrgPage />} />
          <Route path="/artikel/create" element={<CreateArticlePage />} />
          <Route path="/dashboard/artikel/create" element={<CreateArticlePage />} />
          <Route path="/admin/artikel/create" element={<CreateArticlePage />} /> {/* Tambahkan ini */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/artikel/detail" element={<DetailArticlePage />} />
          <Route path="/organizer" element={<DashboardOrganizerPage />} />
          <Route path="/dashboard/event/detail" element={<DetailEventOrganizerPage />} />
          <Route path="/dashboard/event/create" element={<CreateEventPage />} />
          <Route path="/admin" element={<DashboardAdminPage />} />
          <Route path="/admin/event/detail" element={<AdminDetailEventPage />} /> 
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;