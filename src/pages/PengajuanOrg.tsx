import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Impor useNavigate
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PengajuanHeader from '../components/PengajuanOrgComponents/PengajuanHeader';
import KeuntunganSection from '../components/PengajuanOrgComponents/KeuntunganSection';
import FormPengajuan from '../components/PengajuanOrgComponents/FormPengajuan';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

const PengajuanOrgPage: React.FC = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate(); // 2. Inisialisasi hook navigasi

  const handleSuccess = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const handleFailure = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  // 3. Buat fungsi baru untuk menangani penutupan modal sukses
  const handleSuccessModalClose = () => {
      setIsSuccessModalOpen(false);
      navigate('/'); // Arahkan ke halaman utama
  };

  return (
    <>
      <div className="bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-6 py-12 mt-16">
          <div className="space-y-12">
            <PengajuanHeader />
            <KeuntunganSection />
            <FormPengajuan 
              onSuccess={handleSuccess}
              onFailure={handleFailure}
            />
          </div>
        </main>
        <Footer />
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose} // 4. Gunakan fungsi baru di sini
        title="Pengajuan Terkirim!"
        message={modalMessage}
        buttonText="Selesai"
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Pengajuan Gagal"
        message={modalMessage}
        buttonText="Coba Lagi"
      />
    </>
  );
};

export default PengajuanOrgPage;
