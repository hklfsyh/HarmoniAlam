// src/components/ProfileComponents/ProfileContent.tsx

import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import MyArticleDetail from './MyArticleDetail'; // Impor komponen detail artikel

// Komponen untuk satu kartu di "Event yang Diikuti"
const JoinedEventCard = () => (
    <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="font-bold text-[#1A3A53]">Bersih Kali Ciliwung</h3>
        <p className="text-sm text-gray-500">Pembersihan Sungai - Organizer: Green Jakarta Foundation</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1"><Calendar size={14} /><span>10 Juli 2025</span></div>
          <div className="flex items-center gap-1"><MapPin size={14} /><span>Kali Ciliwung, Jakarta Pusat</span></div>
        </div>
      </div>
      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mt-2 md:mt-0">Selesai</span>
    </div>
  );

// Komponen untuk satu kartu di "Artikel Saya"
const MyArticleCard = ({ onView, onEdit }: { onView: () => void, onEdit: () => void }) => (
    <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
        <h3 className="font-bold text-[#1A3A53]">Tips Mengurangi Sampah Plastik</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><Calendar size={14} /><span>20 Juli 2024</span></div>
    </div>
    <div className="flex items-center gap-2 mt-2 md:mt-0">
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Dipublikasi</span>
        <button onClick={onEdit} className="text-xs border px-3 py-1 rounded-md hover:bg-gray-100">Edit</button>
        <button onClick={onView} className="text-xs border px-3 py-1 rounded-md hover:bg-gray-100">Lihat</button>
    </div>
    </div>
);

// Tipe props untuk komponen ProfileContent
interface ProfileContentProps {
  activeTab: 'event' | 'artikel';
  setActiveTab: (tab: 'event' | 'artikel') => void;
  viewingArticle: boolean;
  setViewingArticle: (view: boolean) => void;
  onEditArticle: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab, setActiveTab, viewingArticle, setViewingArticle, onEditArticle }) => {
  
  // Jika state 'viewingArticle' true, tampilkan halaman detail artikel
  if (viewingArticle && activeTab === 'artikel') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <MyArticleDetail onBack={() => setViewingArticle(false)} />
      </div>
    );
  }

  // Tampilan default (daftar event atau artikel)
  return (
    <div>
      {/* Tab Switcher */}
      <div className="bg-slate-200 p-1 rounded-lg flex">
        <button
          onClick={() => { setActiveTab('event'); setViewingArticle(false); }}
          className={`w-1/2 py-2 rounded-md font-semibold transition-all ${activeTab === 'event' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
          Event yang Diikuti
        </button>
        <button
          onClick={() => { setActiveTab('artikel'); setViewingArticle(false); }}
          className={`w-1/2 py-2 rounded-md font-semibold transition-all ${activeTab === 'artikel' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
          Artikel Saya
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        {activeTab === 'event' ? (
          <div>
            <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Event yang Diikuti</h2>
            <div className="space-y-4">{Array(5).fill(<JoinedEventCard />)}</div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Artikel yang Dibuat</h2>
            <div className="space-y-4">
              {/* Kirim fungsi ke setiap kartu artikel */}
              {Array(3).fill(<MyArticleCard onView={() => setViewingArticle(true)} onEdit={onEditArticle} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;