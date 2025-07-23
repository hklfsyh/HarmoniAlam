// src/components/OrganizerComponents/KelolaEventTab.tsx
import React from 'react';
import { Eye, Pencil, Trash2, Search, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const eventData = [
  {
    title: 'Bersih Pantai Ancol',
    category: 'Pembersihan Pantai',
    date: '25 Juli 2024',
    time: '08:00 - 12:00',
    location: 'Pantai Ancol, Jakarta',
    participants: '45/100',
    status: 'Akan Datang',
  },
  {
    title: 'Tanam Mangrove Muara Angke',
    category: 'Penanaman',
    date: '28 Juli 2024',
    time: '08:00 - 12:00',
    location: 'Muara Angke, Jakarta',
    participants: '45/100',
    status: 'Akan Datang',
  },
  {
    title: 'Edukasi Lingkungan Sekolah',
    category: 'Edukasi',
    date: '10 Juli 2024',
    time: '08:00 - 12:00',
    location: 'Taman Suropati, Jakarta',
    participants: '80/80',
    status: 'Selesai',
  },
];

interface KelolaEventTabProps {
    onEditClick: () => void; // Tambahkan prop ini
}

const KelolaEventTab: React.FC<KelolaEventTabProps> = ({ onEditClick }) =>(
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input type="text" placeholder="Cari Aksi...." className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#79B829] outline-none" />
    </div>
    
    <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Event Saya</h2>
    
    <div className="border rounded-lg">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 uppercase border-b">
        <div className="col-span-4">Event</div>
        <div className="col-span-2">Tanggal & Waktu</div>
        <div className="col-span-2">Lokasi</div>
        <div className="col-span-1">Partisipan</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2 text-right">Aksi</div>
      </div>
      
      {/* Table Body */}
      <div className="text-sm">
        {eventData.map((event, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b last:border-b-0">
            <div className="col-span-4">
              <p className="font-bold text-[#1A3A53]">{event.title}</p>
              <p className="text-xs text-gray-500">{event.category}</p>
            </div>
            <div className="col-span-2 flex items-center gap-2">
                <Calendar size={16} className="text-gray-400"/> 
                <div>{event.date}<p className="text-xs text-gray-500">{event.time}</p></div>
            </div>
            <div className="col-span-2 flex items-center gap-2"><MapPin size={16} className="text-gray-400"/> {event.location}</div>
            <div className="col-span-1">{event.participants}</div>
            <div className={`col-span-1 font-semibold ${event.status === 'Selesai' ? 'text-green-600' : 'text-blue-600'}`}>
              {event.status}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-3 text-gray-500">
              <Link to="/dashboard/event/detail" className="hover:text-[#1A3A53]"><Eye size={18}/></Link>
              <button onClick={onEditClick} className="hover:text-[#1A3A53]"><Pencil size={18}/></button> {/* Gunakan prop di sini */}
              <button className="hover:text-red-500"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default KelolaEventTab;