import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Coba Lagi"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-[9999] p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center relative z-[10000]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
