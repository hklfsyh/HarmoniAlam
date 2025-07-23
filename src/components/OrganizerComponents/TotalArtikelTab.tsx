// src/components/OrganizerComponents/TotalArtikelTab.tsx
import React from 'react';
import { Eye, Pencil, Trash2, Search, Calendar } from 'lucide-react';

const articleData = [
    {
        title: "Dampak Perubahan Iklim terhadap Ekosistem Pantai Jakarta",
        excerpt: "Dampak Perubahan Iklim terhadap Ekosistem Pantai Jakarta",
        date: "25 Juli 2024",
        category: "Lingkungan"
    },
    {
        title: "Teknologi Hijau untuk Masa Depan Berkelanjutan",
        excerpt: "Teknologi Hijau untuk Masa Depan Berkelanjutan",
        date: "28 Juli 2024",
        category: "Teknologi"
    },
    {
        title: "Teknologi Hijau untuk Masa Depan Berkelanjutan",
        excerpt: "Teknologi Hijau untuk Masa Depan Berkelanjutan",
        date: "10 Juli 2024",
        category: "Lifestyle"
    },
];

// 1. Definisikan tipe untuk props, termasuk onViewClick
interface TotalArtikelTabProps {
    onViewClick: () => void;
    onEditClick: () => void;
}

// 2. Terima 'onViewClick' sebagai props di dalam kurung kurawal
const TotalArtikelTab: React.FC<TotalArtikelTabProps> = ({ onViewClick, onEditClick }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Cari Artikel...." className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#79B829] outline-none" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Artikel</h2>

        <div className="border rounded-lg">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 uppercase border-b">
                <div className="col-span-4">Artikel</div>
                <div className="col-span-1">Tanggal</div>
                <div className="col-span-2">Kategori</div>
                <div className="col-span-1 text-right">Aksi</div>
            </div>

            {/* Table Body */}
            <div className="text-sm">
                {articleData.map((article, index) => (
                    <div key={index} className="grid grid-cols-8 gap-4 px-4 py-3 items-center border-b last:border-b-0">
                        <div className="col-span-4">
                            <p className="font-bold text-[#1A3A53] truncate">{article.title}</p>
                            <p className="text-xs text-gray-500 truncate">{article.excerpt}</p>
                        </div>
                        <div className="col-span-1 flex items-center gap-2"><Calendar size={16} className="text-gray-400"/>{article.date}</div>
                        <div className="col-span-2">{article.category}</div>
                        <div className="col-span-1 flex items-center justify-end gap-3 text-gray-500">
                            {/* 3. Gunakan 'onViewClick' pada event onClick tombol */}
                            <button onClick={onViewClick} className="hover:text-[#1A3A53]"><Eye size={18}/></button>
                            <button onClick={onEditClick} className="hover:text-[#1A3A53]"><Pencil size={18}/></button>
                            <button className="hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default TotalArtikelTab;