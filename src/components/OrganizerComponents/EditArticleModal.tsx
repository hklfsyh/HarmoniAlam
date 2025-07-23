// src/components/OrganizerComponents/EditArticleModal.tsx
import React from 'react';

// Helper component lokal untuk form field
interface FormFieldProps {
  label: string;
  value: string;
  multiline?: boolean;
  type?: string;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({ label, value, multiline = false, type = 'text', rows = 4 }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      {multiline ? (
        <textarea defaultValue={value} rows={rows} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" />
      ) : (
        <input type={type} defaultValue={value} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" />
      )}
    </div>
);

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Edit Artikel</h2>
        <form className="space-y-6">
            <FormField label="Judul Artikel" value="Dampak Perubahan Iklim terhadap Ekosistem Pantai Jakarta" />
            <FormField label="Kategori Artikel" value="Lingkungan" />
            <FormField label="Ringkasan Artikel" value="Perubahan iklim telah menjadi salah satu tantangan terbesar..." multiline />
            <FormField label="Konten Artikel" value="Pantai Jakarta yang dulunya kaya akan ekosistem..." multiline rows={8} />
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Gambar</label>
                <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-[#1A3A53] hover:file:bg-slate-100"/>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">Batal</button>
              <button type="submit" className="px-6 py-2 bg-[#79B829] text-white rounded-lg font-semibold hover:bg-opacity-90">Simpan Perubahan</button>
            </div>
          </form>
      </div>
    </div>
  );
};
export default EditArticleModal;