import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode; // Menggunakan React.ReactNode agar bisa menerima teks kompleks
  buttonText: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText
}) => {
  if (!isOpen) return null;

  // Tentukan ikon berdasarkan pesan
  const isCancellation = typeof message === 'string' && message.includes('Pendaftaran berhasil dibatalkan');
  const IconComponent = isCancellation ? X : CheckCircle;

  // Tentukan judul berdasarkan pesan
  const displayTitle = isCancellation ? 'Pendaftaran Dibatalkan' : title;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close modal">
          <X size={24} />
        </button>
        <IconComponent size={48} className={`mx-auto mb-4 ${isCancellation ? 'text-red-500' : 'text-green-500'}`} />
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-2">{displayTitle}</h2>
        <div className="text-gray-600 mb-6">
          {message}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#1A3A53] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90"
          aria-label="Close modal and confirm"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;