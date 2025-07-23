// src/components/AdminComponents/DetailOrganizerView.tsx
import React from 'react';
import { ArrowLeft, Calendar, Mail, Phone, MapPin, Globe, History, Link as LinkIcon } from 'lucide-react';

interface DetailOrganizerViewProps {
  onBack: () => void;
}

const DetailOrganizerView: React.FC<DetailOrganizerViewProps> = ({ onBack }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4">
        <ArrowLeft size={20} />
        Kembali ke Dashboard
      </button>
      <h1 className="text-3xl font-bold text-[#1A3A53]">Detail Organizer</h1>
      <p className="mt-1 text-gray-500 mb-8">Informasi lengkap organizer dan aktivitasnya</p>

      {/* Grid Konten */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-4 border rounded-lg"><p className="text-gray-500">Total Event</p><p className="text-3xl font-bold">12</p></div>
            <div className="flex justify-between items-center p-4 border rounded-lg"><p className="text-gray-500">Volunteers</p><p className="text-3xl font-bold">900</p></div>
          </div>

          {/* Informasi Organisasi */}
          <div className="border p-6 rounded-lg">
            <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Organisasi</h2>
            <div className="flex items-start gap-4">
              <img src="https://via.placeholder.com/100" alt="Logo Organisasi" className="h-24 w-24 rounded-lg object-cover" />
              <div>
                <h3 className="font-bold text-lg">EcoJakarta Community</h3>
                <p className="text-sm text-gray-600">Komunitas peduli lingkungan...</p>
              </div>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Globe size={16}/><span>https://www.ecojakarta.org</span></div>
                <div className="flex items-center gap-2"><History size={16}/><span>5 tahun</span></div>
                <div className="flex items-center gap-2"><LinkIcon size={16}/><span>Lihat Dokumen</span></div>
            </div>
          </div>
          
          {/* Event Terbaru */}
          <div>
            <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Event Terbaru</h2>
            <div className="border rounded-lg text-sm divide-y">
                {/* Header */}
                <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-slate-50 font-semibold text-gray-500">
                    <div className="col-span-2">Event</div><div>Lokasi</div><div>Partisipan</div><div>Status</div>
                </div>
                {/* Baris data */}
                <div className="grid grid-cols-5 gap-4 px-4 py-3 items-center">
                    <div className="col-span-2"><strong>Bersih Pantai Ancol</strong><p className="text-xs text-gray-500">25 Juli 2024</p></div>
                    <div>Pantai Ancol, Jakarta</div><div>45/100</div><div className="text-blue-600">Akan Datang</div>
                </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="lg:col-span-1 space-y-8">
            {/* Informasi Kontak */}
            <div className="border p-6 rounded-lg"><h2 className="text-xl font-bold mb-4">Informasi Kontak</h2>
                <div className="space-y-4 text-sm"><div><p className="text-xs">Nama Pemohon</p><p className="font-semibold">Budi Santoso</p></div><div><p className="text-xs">Email</p><p className="text-green-600 flex items-center gap-2"><Mail size={14}/>budi@ecojakarta.org</p></div><div><p className="text-xs">Telepon</p><p className="flex items-center gap-2"><Phone size={14}/>+62 812-3456-7890</p></div><div><p className="text-xs">Alamat</p><p className="flex items-center gap-2"><MapPin size={14}/>Jl. Sudirman No. 123...</p></div></div>
            </div>
            {/* Statistik Bergabung */}
             <div className="border p-6 rounded-lg"><h2 className="text-xl font-bold mb-4">Statistik Bergabung</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2"><Calendar size={14}/>Bergabung Sejak: <strong>18 Juli 2024</strong></div>
                    <div className="flex justify-between"><span>Event Selesai</span><strong>1</strong></div>
                    <div className="flex justify-between"><span>Event Mendatang</span><strong>2</strong></div>
                    <div className="flex justify-between"><span>Rata-rata peserta</span><strong>45</strong></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
export default DetailOrganizerView;