// src/components/AdminComponents/DetailVolunteerView.tsx
import React from 'react';
import { ArrowLeft, Calendar, Mail, Activity, TrendingUp } from 'lucide-react';

// Komponen kecil lokal untuk kartu event
type EventItemCardProps = {
  title: string;
  date: string;
  hours: string;
};

const EventItemCard: React.FC<EventItemCardProps> = ({ title, date, hours }) => (
    <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
        <div>
            <p className="font-semibold text-sm text-[#1A3A53]">{title}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Calendar size={14} /><span>{date}</span>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs text-gray-500">Jam Volunteer</p>
            <p className="font-semibold text-green-600">{hours}</p>
        </div>
    </div>
);

interface DetailVolunteerViewProps {
  onBack: () => void;
}

const DetailVolunteerView: React.FC<DetailVolunteerViewProps> = ({ onBack }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4">
        <ArrowLeft size={20} />
        Kembali ke Dashboard
      </button>
      <h1 className="text-3xl font-bold text-[#1A3A53]">Detail Volunteer</h1>
      <p className="mt-1 text-gray-500 mb-8">Informasi lengkap volunteer</p>

      {/* Grid Konten */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-8">
          {/* Total Event Card */}
          <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
              <div>
                  <p className="text-gray-500">Total Event</p>
                  <p className="text-3xl font-bold text-[#1A3A53]">12</p>
              </div>
              <Calendar size={32} className="text-gray-400"/>
          </div>

          {/* Event Terbaru */}
          <div>
            <h2 className="text-xl font-bold text-[#1A3A53] mb-4 flex items-center gap-2"><TrendingUp size={20}/> Event Terbaru yang Diikuti</h2>
            <div className="space-y-3">
              <EventItemCard title="Pembersihan Pantai Ancol" date="20 Juli 2024" hours="4 jam" />
              <EventItemCard title="Pembersihan Pantai Ancol" date="20 Juli 2024" hours="4 jam" />
              <EventItemCard title="Pembersihan Pantai Ancol" date="20 Juli 2024" hours="4 jam" />
            </div>
          </div>
           {/* Event Mendatang */}
          <div>
            <h2 className="text-xl font-bold text-[#1A3A53] mb-4 flex items-center gap-2"><Calendar size={20}/> Event Mendatang</h2>
            <div className="space-y-3">
              <EventItemCard title="Workshop Sustainability" date="20 Juli 2024" hours="4 jam" />
              <EventItemCard title="Workshop Sustainability" date="20 Juli 2024" hours="4 jam" />
            </div>
          </div>
        </div>

        {/* Kolom Kanan (Sidebar) */}
        <div className="lg:col-span-1">
            <div className="border p-6 rounded-lg h-full">
                <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Personal</h2>
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="text-xs text-gray-500">Nama Lengkap</p>
                        <p className="font-semibold text-lg">Lisa Chen</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-green-600 flex items-center gap-2"><Mail size={14} />lisa@email.com</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Bergabung Sejak</p>
                        <p className="flex items-center gap-2"><Calendar size={14} />15 Juli 2024</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Aktivitas Terakhir</p>
                        <p className="flex items-center gap-2"><Activity size={14} />20 Juli 2024</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVolunteerView;