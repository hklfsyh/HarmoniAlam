import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isConfirming?: boolean;
  title: string;
  message: string;
  confirmText?: string;
}

const DeleteReasonModal: React.FC<DeleteReasonModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isConfirming = false,
  title,
  message,
  confirmText = "Ya, Hapus"
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onConfirm(reason);
    } else {
      alert('Alasan tidak boleh kosong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1A3A53]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="flex items-start gap-4">
            <AlertTriangle size={32} className="text-red-500 flex-shrink-0" />
            <p className="text-gray-600">{message}</p>
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded-lg mt-4"
          placeholder="Tuliskan alasan di sini..."
        />
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isConfirming}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400"
          >
            {isConfirming ? 'Menghapus...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReasonModal;
