// src/pages/AdminDetailEventPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Kita bisa gunakan kembali komponen dari Detail Event Organizer
import DetailEventOrgTabs from '../components/DetailEventOrganizerComponents/DetailEventOrgTabs';
import OverviewTab from '../components/DetailEventOrganizerComponents/OverviewTab';
import PartisipanTab from '../components/DetailEventOrganizerComponents/PartisipanTab';
import AnalitikTab from '../components/DetailEventOrganizerComponents/AnalitikTab';
import { ArrowLeft } from 'lucide-react';

const AdminDetailEventPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    const renderContent = () => {
      switch (activeTab) {
        case 'Overview': return <OverviewTab />;
        case 'Partisipan': return <PartisipanTab />;
        case 'Analitik': return <AnalitikTab />;
        default: return <OverviewTab />;
      }
    };

    return (
        <div className="bg-slate-100 min-h-screen">
            <main className="container mx-auto px-6 py-8 mt-16">
                {/* Header Halaman */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-2">
                            <ArrowLeft size={20} />
                            Kembali ke Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-[#1A3A53]">Bersih Pantai Ancol</h1>
                        <span className="mt-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                            Akan Datang
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Di sini hanya ada tombol Hapus sesuai permintaan */}
                        <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700">
                            Hapus Event
                        </button>
                    </div>
                </div>

                <DetailEventOrgTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div>{renderContent()}</div>

            </main>
        </div>
    );
};

export default AdminDetailEventPage;