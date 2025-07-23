// src/pages/CreateEventPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Helper component lokal untuk form field agar tidak berulang
type FormFieldProps = {
  label: string;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
};

const FormField: React.FC<FormFieldProps> = ({ label, placeholder, multiline = false, type = 'text' }) => {
  let field;
  if (type === 'file') {
    field = (
      <input
        type="file"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#79B829] outline-none transition"
      />
    );
  } else if (multiline) {
    field = (
      <textarea
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#79B829] outline-none transition"
      ></textarea>
    );
  } else {
    field = (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#79B829] outline-none transition"
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

const CreateEventPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">

      <main className="container mx-auto px-6 py-12 mt-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto">
          <Link to="/organizer" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-6">
            <ArrowLeft size={20} />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-[#1A3A53]">
            Buat Event Lingkungan
          </h1>
          <p className="mt-2 text-gray-600">
            Buat event lingkungan baru dan ajak komunitas untuk berpartisipasi dalam menjaga lingkungan
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-[#1A3A53] mb-8">Buat Event Baru</h2>
          <form className="space-y-6">
            <FormField label="Judul Event" placeholder="Placeholder..." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Kategori Event" placeholder="Placeholder..." />
              <FormField label="Maksimal Partisipan" type="number" placeholder="Placeholder..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Tanggal Event" type="date" placeholder="Placeholder..." />
              <FormField label="Waktu Event" type="time" placeholder="Placeholder..." />
            </div>

            <FormField label="Lokasi Event" placeholder="Placeholder..." />
            <FormField label="Deskripsi Event" placeholder="Placeholder..." multiline />
            <FormField label="Kebutuhan yang Harus Dibawa" placeholder="Placeholder..." multiline />
            <FormField label="Kebutuhan yang Disediakan" placeholder="Placeholder..." multiline />
            <FormField label="Gambar" type="file" />

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="reset"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Buat Event
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEventPage;