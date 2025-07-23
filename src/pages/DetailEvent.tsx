// src/pages/DetailEvent.tsx

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventHeader from '../components/DetailEventComponents/EventHeader';
import EventDescription from '../components/DetailEventComponents/EventDescription';
import EventRequirements from '../components/DetailEventComponents/EventRequirements';
import EventSidebar from '../components/DetailEventComponents/EventSidebar';

const DetailEventPage: React.FC = () => {
  return (
    <div className="bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-12 px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <EventHeader />
            <EventDescription />
            <EventRequirements />
          </div>

          {/* Sidebar */}
          <div>
            <EventSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetailEventPage;