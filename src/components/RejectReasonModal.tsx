import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting?: boolean;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    } else {
      alert('Alasan penolakan tidak boleh kosong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1A3A53]">Alasan Penolakan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Harap berikan alasan yang jelas mengapa pengajuan organizer ini ditolak. Alasan ini akan dikirimkan ke pemohon.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
          className="w-full p-2 border rounded-lg"
          placeholder="Contoh: Dokumen yang Anda unggah tidak valid atau tidak terbaca..."
        />
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Penolakan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonModal;
