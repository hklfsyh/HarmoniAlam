// src/components/AdminComponents/DetailPengajuanView.tsx
import React from 'react';
import { ArrowLeft, Building2, FileText, Mail, Phone, MapPin, Calendar, Globe, History } from 'lucide-react';

interface DetailPengajuanViewProps {
  onBack: () => void;
}

const DetailPengajuanView: React.FC<DetailPengajuanViewProps> = ({ onBack }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4">
        <ArrowLeft size={20} />
        Kembali ke Dashboard
      </button>
      <h1 className="text-3xl font-bold text-[#1A3A53]">Detail Pengajuan Organizer</h1>
      <p className="mt-1 text-gray-500 mb-8">Komunitas peduli lingkungan yang berfokus pada kegiatan pembersihan dan edukasi lingkungan di Jakarta</p>

      {/* Grid Konten */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-8">
          {/* Kartu Informasi Organisasi */}
          <div className="border p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4"><Building2 className="text-[#1A3A53]" /><h2 className="text-xl font-bold text-[#1A3A53]">Informasi Organisasi</h2></div>
            <div className="space-y-3"><h3 className="font-bold text-lg">EcoJakarta Community</h3><p className="text-sm text-gray-600">Komunitas peduli lingkungan...</p></div>
            <hr className="my-4" />
            <div className="flex justify-between text-sm"><div className="flex items-center gap-2"><Globe size={16} /><span>https://www.ecojakarta.org</span></div><div className="flex items-center gap-2"><History size={16} /><span>5 tahun</span></div></div>
          </div>
          {/* Kartu Dokumen Pendukung */}
          <div className="border p-6 rounded-lg text-center"><div className="flex items-center justify-center gap-3 mb-4"><FileText className="text-[#1A3A53]" /><h2 className="text-xl font-bold text-[#1A3A53]">Dokumen Pendukung</h2></div><div className="flex flex-col items-center justify-center text-gray-400 p-8"><FileText size={64} /><p className="mt-2 text-sm">dokumen_legalitas.pdf</p></div></div>
        </div>

        {/* Kolom Kanan */}
        <div className="lg:col-span-1 space-y-8">
          {/* Kartu Informasi Kontak */}
          <div className="border p-6 rounded-lg"><h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Kontak</h2><div className="space-y-4 text-sm"><div><p className="text-xs text-gray-500">Nama Pemohon</p><p className="font-semibold">Budi Santoso</p></div><div><p className="text-xs text-gray-500">Email</p><p className="text-[#79B829] flex items-center gap-2"><Mail size={14} />budi@ecojakarta.org</p></div><div><p className="text-xs text-gray-500">Telepon</p><p className="flex items-center gap-2"><Phone size={14} />+62 812-3456-7890</p></div><div><p className="text-xs text-gray-500">Alamat</p><p className="flex items-center gap-2"><MapPin size={14} />Jl. Sudirman No. 123...</p></div></div></div>
          {/* Kartu Informasi Pengajuan */}
          <div className="border p-6 rounded-lg"><h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Pengajuan</h2><div className="flex items-center gap-2 mb-6"><Calendar size={16} /><span>Tanggal Pengajuan: <strong>18 Juli 2024</strong></span></div><div className="space-y-3"><button className="w-full bg-[#79B829] text-white font-bold py-2.5 rounded-lg">Setujui Pengajuan</button><button className="w-full border border-red-500 text-red-500 font-bold py-2.5 rounded-lg">Tolak Pengajuan</button></div></div>
        </div>
      </div>
    </div>
  );
};

export default DetailPengajuanView;