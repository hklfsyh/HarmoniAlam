// src/components/PengajuanOrgComponents/FormPengajuan.tsx

import React from 'react';

type FormFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  multiline?: boolean;
};

const FormField: React.FC<FormFieldProps> = ({ label, type = 'text', placeholder, optional = false, multiline = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">
      {label} {optional && <span className="text-gray-500 font-normal">(Opsional)</span>}
    </label>
    {multiline ? (
      <textarea placeholder={placeholder} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" />
    ) : (
      <input type={type} placeholder={placeholder} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" />
    )}
  </div>
);

const FormPengajuan: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1A3A53] mb-6">Form Pengajuan Organizer</h2>
      <form className="space-y-6">
        <FormField label="Nama Organisasi" placeholder="Placeholder..." />
        <FormField label="Deskripsi Organisasi" placeholder="Placeholder..." multiline />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Nama Penanggung Jawab" placeholder="Placeholder..." />
          <FormField label="Email Organisasi" type="email" placeholder="Placeholder..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Nomor Telepon" type="tel" placeholder="Placeholder..." />
          <FormField label="Website" placeholder="Placeholder..." optional />
        </div>
        <FormField label="Alamat Organisasi" placeholder="Placeholder..." multiline />
        <FormField label="Pengalaman Mengorganisir Event" placeholder="Placeholder..." multiline />
        <FormField label="Media Sosial" placeholder="Placeholder..." optional />
        
        {/* Upload Dokumen */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Upload Dokumen</label>
          <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 border-dashed rounded-md">
            <div className="text-center">
              <p className="text-sm text-gray-600">Drag & drop atau klik untuk upload</p>
            </div>
          </div>
        </div>

        {/* Persetujuan */}
        <div className="flex items-start gap-3">
          <input id="agreement" type="checkbox" className="h-5 w-5 mt-0.5 rounded border-gray-300" />
          <label htmlFor="agreement" className="text-sm text-gray-700">
            Saya menyetujui Syarat & Ketentuan Organizer dan bersedia mengikuti pedoman platform Harmoni Alam. Saya memahami bahwa informasi yang diberikan akan diverifikasi oleh tim.
          </label>
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="w-full bg-[#1A3A53] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
          Kirim Pengajuan
        </button>
      </form>
    </div>
  );
};

export default FormPengajuan;