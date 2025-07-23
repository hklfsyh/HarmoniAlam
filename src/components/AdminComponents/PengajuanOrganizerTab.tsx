// src/components/AdminComponents/PengajuanOrganizerTab.tsx
import React from 'react';
import { Eye, Check, X, Search } from 'lucide-react';

interface PengajuanOrganizerTabProps {
    onViewClick: () => void;
}

const PengajuanOrganizerTab: React.FC<PengajuanOrganizerTabProps> = ({ onViewClick }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder="Cari..." className="w-full pl-12 pr-4 py-3 border rounded-lg"/></div>
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Pengajuan Organizer</h2>
        <div className="border rounded-lg text-sm"><div className="grid grid-cols-7 gap-4 px-4 py-2 bg-slate-50 font-semibold text-gray-500 border-b">
            <div className="col-span-2">Pemohon</div><div>Organisasi</div><div>Kontak</div><div>Pengalaman</div><div>Tgl Pengajuan</div><div className="text-right">Aksi</div></div>
            <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 px-4 py-3 items-center">
                    <div className="col-span-2"><strong>Budi Santoso</strong><p className="text-xs">budi@ecojakarta.org</p></div>
                    <div>EcoJakarta Community</div><div>+62 812-3456-7890</div><div>5 tahun</div><div>25 Juli 2024</div>
                    <div className="flex items-center justify-end gap-2 text-gray-500">
                        <button onClick={onViewClick} className="hover:text-blue-600"><Eye/></button> {/* Ganti di sini */}
                        <button className="hover:text-green-600"><Check/></button>
                        <button className="hover:text-red-600"><X/></button>
                    </div>
                </div>
                 {/* ... Tambah data lain jika perlu ... */}
            </div>
        </div>
    </div>
);
export default PengajuanOrganizerTab;