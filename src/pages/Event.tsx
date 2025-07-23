// src/pages/EventsPage.tsx

import React from 'react';
import HeroSection from '../components/EventComponents/HeroSection';
import FilterEvent from '../components/EventComponents/FilterEvent';
import EventList from '../components/EventComponents/EventList'; // 1. IMPORT KOMPONEN

const EventsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      <main className="flex-grow">
        <HeroSection />
        <FilterEvent />
        <EventList /> {/* 2. LETAKKAN KOMPONEN DI SINI */}
      </main>
    </div>
  );
};

export default EventsPage;