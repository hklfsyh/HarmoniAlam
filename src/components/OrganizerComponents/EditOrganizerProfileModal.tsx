// src/components/OrganizerComponents/EditOrganizerProfileModal.tsx
import React from 'react';

interface EditOrganizerProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FormFieldProps = {
    label: string;
    value?: string;
    multiline?: boolean;
    type?: string;
};

const FormField: React.FC<FormFieldProps> = ({ label, value, multiline = false, type = 'text' }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
        {multiline ? (
            <textarea
                defaultValue={value}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            ></textarea>
        ) : (
            <input
                type={type}
                defaultValue={value}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
        )}
    </div>
);

const EditOrganizerProfileModal: React.FC<EditOrganizerProfileModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Edit Profil Organizer</h2>
                <form className="space-y-4">

                    {/* Profile Picture Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Foto Profil</label>
                        <div className="mt-1 flex items-center gap-4">
                            <span className="inline-block h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                                <img src="https://via.placeholder.com/150" alt="Current profile" className="h-full w-full object-cover" />
                            </span>
                            <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                                <span>Ubah Gambar</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Nama Organizer" value="Budi Susanto" />
                        <FormField label="Nama Organisasi" value="EcoJakarta Community" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Email" type="email" value="admin@ecojakarta.org" />
                        <FormField label="Telepon" type="tel" value="+62 812-3456-7890" />
                    </div>
                    <FormField label="Website" value="https://www.ecojakarta.org" />
                    <FormField label="Deskripsi Organisasi" value="Komunitas peduli lingkungan..." multiline />

                    {/* Document Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Dokumen Legalitas (PDF)</label>
                        <input
                            type="file"
                            accept=".pdf"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1A3A53] hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Jika ada, unggah dokumen legalitas organisasi Anda.</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrganizerProfileModal;