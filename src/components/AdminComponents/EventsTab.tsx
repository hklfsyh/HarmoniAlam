// src/components/AdminComponents/EventsTab.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Impor Link
import { Eye,  Trash2} from 'lucide-react';

// Hapus onViewClick dari props, karena tidak dibutuhkan lagi
const EventsTab: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        {/* ... (kode search bar dan judul tetap sama) ... */}
        <div className="border rounded-lg text-sm">
            {/* ... (kode header tabel tetap sama) ... */}
            <div className="divide-y">
                 <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                    <div className="col-span-2"><strong>Bersih Pantai Ancol</strong><p className="text-xs">EcoJakarta Community</p></div>
                    <div>25 Juli 2024</div><div>Pantai Ancol</div><div>45/100</div>
                    <div className="flex items-center justify-end gap-2 text-gray-500">
                        {/* Ganti button menjadi Link */}
                        <Link to="/admin/event/detail" className="hover:text-blue-600"><Eye/></Link>
                        <button className="hover:text-red-600"><Trash2/></button>
                    </div>
                </div>
                 {/* ... data lain ... */}
            </div>
        </div>
    </div>
);
export default EventsTab;