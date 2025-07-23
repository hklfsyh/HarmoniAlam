// src/components/AdminComponents/ArtikelTab.tsx
import React from 'react';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';

// Tambahkan props
interface ArtikelTabProps {
    onViewClick: () => void;
    onEditClick: () => void;
}

const ArtikelTab: React.FC<ArtikelTabProps> = ({ onViewClick, onEditClick }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input type="text" placeholder="Cari..." className="w-full pl-12 pr-4 py-3 border rounded-lg"/>
        </div>
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Artikel</h2>
        <div className="border rounded-lg text-sm">
            <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-slate-50 font-semibold text-gray-500 border-b">
                <div className="col-span-2">Artikel</div>
                <div>Tanggal</div>
                <div className="text-right">Aksi</div>
            </div>
            <div className="divide-y">
                 <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                    <div className="col-span-2"><strong>Dampak Perubahan Iklim...</strong><p className="text-xs">Dampak Perubahan Iklim...</p></div>
                    <div>25 Juli 2024</div>
                    <div className="flex items-center justify-end gap-2 text-gray-500">
                        <button onClick={onViewClick} className="hover:text-blue-600"><Eye/></button>
                        <button onClick={onEditClick} className="hover:text-green-600"><Pencil/></button>
                        <button className="hover:text-red-600"><Trash2/></button>
                    </div>
                </div>
                 {/* ... data lain ... */}
            </div>
        </div>
    </div>
);
export default ArtikelTab;