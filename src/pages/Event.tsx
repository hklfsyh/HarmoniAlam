import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import HeroSection from '../components/EventComponents/HeroSection';
import FilterEvent from '../components/EventComponents/FilterEvent';
import EventList from '../components/EventComponents/EventList';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import ConfirmationModal from '../components/ConfirmationModal'; // Impor modal konfirmasi
import volunteerApi from '../API/volunteer'; // Impor API

// Interface untuk Event (bisa ditaruh di file terpisah nanti)
interface Event {
    event_id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    participants: string;
    categoryName: string;
    image: string;
}

interface ApiError {
    response?: { data?: { message?: string; } }
}

// Fungsi untuk membatalkan pendaftaran
const cancelRegistration = (eventId: number) => {
    return volunteerApi.delete(`/events/${eventId}/register`);
};

const EventsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);

  // State baru untuk mengelola modal konfirmasi pembatalan
  const [eventToCancel, setEventToCancel] = React.useState<Event | null>(null);

  const handleRegistrationSuccess = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const handleRegistrationFailure = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  // Fungsi untuk membuka modal konfirmasi
  const handleOpenCancelModal = (event: Event) => {
    setEventToCancel(event);
  };

  // Mutasi untuk pembatalan event
  const cancelMutation = useMutation({
      mutationFn: cancelRegistration,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['publicEvents'] });
          queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
          handleRegistrationSuccess('Pendaftaran berhasil dibatalkan.');
      },
      onError: (error: ApiError) => {
          handleRegistrationFailure(error.response?.data?.message || 'Terjadi kesalahan saat membatalkan pendaftaran.');
      }
  });

  const handleConfirmCancel = () => {
    if (eventToCancel) {
        cancelMutation.mutate(eventToCancel.event_id);
        setEventToCancel(null); // Tutup modal setelah konfirmasi
    }
  };

  return (
    <>
      <div className={`bg-slate-50 min-h-screen ${eventToCancel ? 'blur-sm' : ''}`}>
        <main className="flex-grow">
          <HeroSection />
          <FilterEvent 
            setSearchTerm={setSearchTerm}
            setSelectedCategory={setSelectedCategory}
          />
          <EventList 
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSuccess={handleRegistrationSuccess}
            onFailure={handleRegistrationFailure}
            onCancelClick={handleOpenCancelModal} // Kirim fungsi ke EventList
          />
        </main>
      </div>

      {/* Modal Sukses dan Error (tetap sama) */}
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

      {/* Satu Modal Konfirmasi untuk Seluruh Halaman */}
      <ConfirmationModal
          isOpen={!!eventToCancel}
          onClose={() => setEventToCancel(null)}
          onConfirm={handleConfirmCancel}
          title="Konfirmasi Pembatalan"
          message={`Apakah Anda yakin ingin membatalkan pendaftaran untuk event "${eventToCancel?.title}"?`}
          confirmText="Ya, Batalkan"
          cancelText="Tidak"
          isConfirming={cancelMutation.isPending}
      />
    </>
  );
};
export default EventsPage;