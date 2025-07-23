// src/components/DetailEventOrganizerComponents/PartisipanTab.tsx
import React from 'react';
import { Search } from 'lucide-react';

const PartisipanTab: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Cari Partisipan...." className="w-full pl-12 pr-4 py-3 border rounded-lg" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Daftar Partisipan</h2>
        <div className="border rounded-lg text-sm">
            <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-slate-50 font-semibold text-gray-500 border-b">
                <div>Nama</div><div>Email</div><div>Tanggal Daftar</div><div>Status</div>
            </div>
            <div className="divide-y">
                <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                    <div>Ahmad Sari</div><div>ahmad@email.com</div><div>25 Juli 2024</div><div className="text-blue-600">Akan Datang</div>
                </div>
                <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                    <div>Siti Nurhaliza</div><div>siti@email.com</div><div>25 Juli 2024</div><div className="text-blue-600">Akan Datang</div>
                </div>
                <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                    <div>Budi Santoso</div><div>budi@email.com</div><div>25 Juli 2024</div><div className="text-green-600">Selesai</div>
                </div>
            </div>
        </div>
    </div>
);
export default PartisipanTab;