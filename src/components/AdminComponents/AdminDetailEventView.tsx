import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '../../API/admin';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import AdminPartisipanTab from './AdminPartisipanTab';

//=================================================================
// KOMPONEN-KOMPONEN LOKAL
//=================================================================
const TABS = ['Overview', 'Partisipan']; // Tab Analitik dihapus
const DetailEventTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; }> = ({ activeTab, setActiveTab }) => (
  <div className="bg-slate-200 p-1 rounded-lg flex flex-col sm:flex-row gap-1 mb-6">
    {TABS.map(tab => (
      <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full py-2 px-4 rounded-md font-semibold text-sm transition-all ${activeTab === tab ? 'bg-white shadow' : 'text-gray-600'}`}>
        {tab}
      </button>
    ))}
  </div>
);

const formatTime = (isoString: string) => new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
const InfoItem: React.FC<{ icon: React.ReactElement; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-4"><div className="text-[#79B829] mt-1">{icon}</div><div><p className="text-gray-500">{label}</p><p className="font-semibold text-[#1A3A53]">{value}</p></div></div>
);
const InfoSection: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div><h3 className="text-lg font-semibold text-[#1A3A53] mb-2">{label}</h3><p className="text-gray-600 leading-relaxed whitespace-pre-line">{children}</p></div>
);
const OverviewTab: React.FC<{ event: any }> = ({ event }) => (
    <div className="bg-white p-8 rounded-lg shadow-md space-y-8">
        <div><h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Detail Event</h2><img src={event.imagePath} alt={event.title} className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={<Calendar />} label="Tanggal" value={new Date(event.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
                <InfoItem icon={<Clock />} label="Waktu" value={`${formatTime(event.eventTime)} WIB`} />
                <InfoItem icon={<MapPin />} label="Lokasi" value={event.location} />
                <InfoItem icon={<Users />} label="Kapasitas" value={`${event.currentParticipants} / ${event.maxParticipants} orang`} />
                <InfoItem icon={<Tag />} label="Kategori Event" value={event.category.categoryName} />
            </div>
        </div><hr/><div className="space-y-6"><InfoSection label="Deskripsi Event">{event.description}</InfoSection><InfoSection label="Kebutuhan yang Harus Dibawa">{event.requiredItems}</InfoSection><InfoSection label="Kebutuhan yang Disediakan">{event.providedItems}</InfoSection></div>
    </div>
);

//=================================================================
// KOMPONEN UTAMA
//=================================================================

interface AdminDetailEventViewProps {
  eventId: number;
  onBack: () => void;
}

const fetchEventDetail = async (id: number) => {
    const { data } = await adminApi.get(`/events/${id}`);
    return data;
};

const AdminDetailEventView: React.FC<AdminDetailEventViewProps> = ({ eventId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: event, isLoading, isError, error } = useQuery({
      queryKey: ['adminEventDetail', eventId],
      queryFn: () => fetchEventDetail(eventId),
      enabled: !!eventId,
  });

  const renderContent = () => {
    if (isLoading) return <p className="text-center p-4">Memuat data event...</p>;
    if (isError) return <p className="text-center p-4 text-red-500">Gagal memuat data: {error.message}</p>;
    if (!event) return null;

    switch (activeTab) {
      case 'Overview': return <OverviewTab event={event} />;
      case 'Partisipan': return <AdminPartisipanTab eventId={eventId} />;
      default: return <OverviewTab event={event} />;
    }
  };

  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div>
                <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-2">
                    <ArrowLeft size={20} />
                    Kembali ke Dashboard
                </button>
                <h1 className="text-3xl font-bold text-[#1A3A53]">{event?.title || 'Memuat...'}</h1>
                <p className="text-gray-500 mt-1">Oleh: {event?.organizerName || '...'}</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700">
                    Hapus Event
                </button>
            </div>
        </div>
        <DetailEventTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>{renderContent()}</div>
    </div>
  );
};
export default AdminDetailEventView;
