// src/components/RegistrationSuccessModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';

interface RegistrationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({ isOpen, onClose, email }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGoToLogin = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#1A3A53] mb-2">Registrasi Berhasil! ✅</h2>
                <p className="text-gray-600 mb-4">
                    Kami telah mengirimkan email verifikasi ke:
                </p>
                <p className="font-semibold text-[#1A3A53] bg-slate-100 py-2 px-4 rounded-md mb-4 break-all">
                    {email}
                </p>
                <p className="text-sm text-gray-500">
                    Silakan periksa inbox (dan folder spam) Anda untuk mengaktifkan akun. Jika Anda tidak menerima email, periksa kembali apakah alamat email di atas sudah benar.
                </p>
                <button
                    onClick={handleGoToLogin}
                    className="mt-6 w-full bg-[#1A3A53] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90"
                >
                    OK, Lanjutkan ke Login
                </button>
            </div>
        </div>
    );
};

export default RegistrationSuccessModal;