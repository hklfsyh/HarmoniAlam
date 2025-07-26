import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/EventComponents/HeroSection';
import FilterEvent from '../components/EventComponents/FilterEvent';
import EventList from '../components/EventComponents/EventList';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

const EventsPage: React.FC = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleRegistrationSuccess = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const handleRegistrationFailure = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  return (
    <>
      <div className="bg-slate-50 min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <FilterEvent />
          <EventList 
            onSuccess={handleRegistrationSuccess}
            onFailure={handleRegistrationFailure}
          />
        </main>
        <Footer />
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Pendaftaran Berhasil!"
        message={modalMessage}
        buttonText="Luar Biasa!"
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Pendaftaran Gagal"
        message={modalMessage}
        buttonText="Coba Lagi"
      />
    </>
  );
};
export default EventsPage;
