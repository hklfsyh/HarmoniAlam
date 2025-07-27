import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (subject: string, message: string) => void;
  isSending?: boolean;
}

const ContactAdminModal: React.FC<ContactAdminModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isSending = false,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (subject.trim() && message.trim()) {
      onConfirm(subject, message);
    } else {
      alert('Subjek dan pesan tidak boleh kosong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1A3A53] flex items-center gap-2">
            <Mail size={24} />
            Hubungi Admin
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Gunakan formulir ini untuk mengirim pertanyaan atau laporan langsung ke tim admin HarmoniAlam.
        </p>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subjek</label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Contoh: Pertanyaan tentang Fitur Baru"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pesan</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Tuliskan pesan Anda di sini..."
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
            {isSending ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactAdminModal;
