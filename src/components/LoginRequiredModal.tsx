// src/components/LoginRequiredModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, X } from 'lucide-react';

const LoginRequiredModal: React.FC = () => {
  // Ambil state dan fungsi dari AuthContext
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const navigate = useNavigate();

  if (!isLoginModalOpen) return null;

  const handleGoToLogin = () => {
    closeLoginModal();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center relative">
        <button onClick={closeLoginModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-2">Anda Harus Login</h2>
        <p className="text-gray-600 mb-6">
          Untuk dapat berpartisipasi dalam event atau menulis artikel, Anda harus masuk ke akun Anda terlebih dahulu.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={closeLoginModal}
            className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleGoToLogin}
            className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90"
          >
            Pergi ke Halaman Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;