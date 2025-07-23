// src/components/ProfileComponents/EditProfileModal.tsx
import React from 'react';
import { Camera } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormFieldProps = {
  label: string;
  placeholder?: string;
};

const FormField: React.FC<FormFieldProps> = ({ label, placeholder }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
        <input type="text" placeholder={placeholder} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" />
    </div>
);

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-[#1A3A53]">Edit Profile</h2>
        <p className="text-gray-500 mt-1 mb-6">Perbarui informasi personal dan preferensi Anda</p>
        
        <div className="text-center mb-6">
            <div className="relative inline-block">
                <div className="h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-slate-400" />
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Klik ikon kamera untuk mengubah foto profil</p>
        </div>

        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nama Lengkap" placeholder="Placeholder..." />
                <FormField label="Email" placeholder="Placeholder..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nomor Telepon" placeholder="Placeholder..." />
                <FormField label="Lokasi" placeholder="Placeholder..." />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100">Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90">Simpan Perubahan</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;