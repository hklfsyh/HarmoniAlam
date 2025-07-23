// src/components/AdminComponents/VolunteersTab.tsx
import React from 'react';
import { Eye, X, Search } from 'lucide-react';

// Tambahkan onViewClick ke props
interface VolunteersTabProps {
    onViewClick: () => void;
}

const VolunteersTab: React.FC<VolunteersTabProps> = ({ onViewClick }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder="Cari..." className="w-full pl-12 pr-4 py-3 border rounded-lg"/></div>
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Manajemen Volunteers</h2>
        <div className="border rounded-lg text-sm">
            <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-slate-50 font-semibold text-gray-500 border-b">
                <div>Nama</div><div>Email</div><div>Tgl Bergabung</div><div>Event Diikuti</div><div>Aktivitas Terakhir</div><div className="text-right">Aksi</div>
            </div>
            <div className="divide-y">
                <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                    <div>Lisa Chen</div><div>lisa@email.com</div><div>01 Juli 2024</div><div>8</div><div>20 Juli 2024</div>
                    <div className="flex items-center justify-end gap-2 text-gray-500">
                        <button onClick={onViewClick} className="hover:text-blue-600"><Eye/></button>
                        <button className="hover:text-red-600"><X/></button>
                    </div>
                </div>
                 {/* ... data lain ... */}
            </div>
        </div>
    </div>
);
export default VolunteersTab;