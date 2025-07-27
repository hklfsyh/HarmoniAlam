import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (email: string) => void;
    isSending?: boolean;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isSending = false,
}) => {
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (email.trim()) {
            onConfirm(email);
        } else {
            alert('Alamat email tidak boleh kosong.');
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#1A3A53] flex items-center gap-2">
                        Lupa Password
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">
                    Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.
                </p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            id="reset-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="contoh@email.com"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSending}
                        className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400"
                    >
                        {isSending ? 'Mengirim...' : 'Kirim Link Reset'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
