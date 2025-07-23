// src/pages/CreateArticlePage.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';


type FormFieldProps = {
  label: string;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
  rows?: number;
};

const FormField: React.FC<FormFieldProps> = ({ label, placeholder, multiline = false, type = 'text', rows = 4 }) => {
  let field;
  if (type === 'file') {
    field = (
      <input
        type="file"
        className="w-full px-4 py-2 border rounded-lg"
      />
    );
  } else if (multiline) {
    field = (
      <textarea
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2 border rounded-lg"
      />
    );
  } else {
    field = (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg"
      />
    );
  }
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      {field}
    </div>
  );
};


const CreateArticlePage: React.FC = () => {
  const location = useLocation();
  
  // Tentukan path kembali berdasarkan URL saat ini
  let backPath = '';
  let backText = '';

  if (location.pathname.startsWith('/admin')) {
    backPath = '/admin';
    backText = 'Kembali ke Dashboard Admin';
  } else if (location.pathname.startsWith('/dashboard')) {
    backPath = '/dashboard';
    backText = 'Kembali ke Dashboard';
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      <main className="flex-grow container mx-auto px-6 py-12 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Tampilkan link kembali HANYA jika diakses dari admin atau organizer */}
          {backPath ? (
            <Link to={backPath} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-6">
              <ArrowLeft size={20} />
              {backText}
            </Link>
          ) : (
            // Header default jika diakses dari halaman artikel publik
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#79B829]">
                Tulis Artikel Lingkungan
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Bagikan pengetahuan dan tips tentang lingkungan kepada komunitas melalui artikel yang informatif
              </p>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
           <h2 className="text-2xl font-bold text-[#1A3A53] mb-8">Tulis Artikel Baru</h2>
          <form className="space-y-6">
            <FormField label="Judul Artikel" placeholder="Placeholder..." />
            <FormField label="Kategori Artikel" placeholder="Placeholder..." />
            <FormField label="Ringkasan Artikel" placeholder="Placeholder..." multiline />
            <FormField label="Konten Artikel" placeholder="Placeholder..." multiline rows={8} />
            <FormField label="Gambar" type="file" />
            <div className="flex justify-end gap-4 pt-4">
              <button type="reset" className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">Reset Form</button>
              <button type="submit" className="px-6 py-2 bg-[#79B829] text-white rounded-lg font-semibold hover:bg-opacity-90">Publikasikan Artikel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateArticlePage;