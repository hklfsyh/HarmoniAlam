import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag, Search } from 'lucide-react';

//=================================================================
// KOMPONEN-KOMPONEN LOKAL (Digabungkan dalam satu file)
//=================================================================

const TABS = ['Overview', 'Partisipan'];
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

const fetchEventVolunteers = async (eventId: number) => {
    const { data } = await organizerApi.get(`/events/${eventId}/volunteers`);
    return data;
};

const PartisipanTab: React.FC<{ eventId: number }> = ({ eventId }) => {
    const { data: volunteers, isLoading, isError, error } = useQuery({
        queryKey: ['eventVolunteers', eventId],
        queryFn: () => fetchEventVolunteers(eventId),
        enabled: !!eventId,
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Cari Partisipan..." className="w-full pl-12 pr-4 py-3 border rounded-lg"/></div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Daftar Partisipan</h2>
            {isLoading && <p>Memuat daftar partisipan...</p>}
            {isError && <p className="text-red-500">Gagal memuat data: {error.message}</p>}
            {volunteers && (
                <div className="border rounded-lg text-sm overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-slate-50 font-semibold text-gray-500 border-b">
                        <div>Nama</div><div>Email</div><div>Tanggal Daftar</div>
                    </div>
                    <div className="divide-y">
                        {volunteers.length > 0 ? ( volunteers.map((reg: any) => ( <div key={reg.registration_id} className="grid grid-cols-3 gap-4 px-4 py-3 items-center"><div className="font-semibold text-[#1A3A53]">{reg.volunteer.firstName} {reg.volunteer.lastName}</div><div>{reg.volunteer.email}</div><div>{new Date(reg.registeredAt).toLocaleDateString('id-ID')}</div></div>))) : (<p className="p-4 text-gray-500">Belum ada partisipan yang mendaftar.</p>)}
                    </div>
                </div>
            )}
        </div>
    );
};

//=================================================================
// KOMPONEN UTAMA
//=================================================================

interface DetailEventViewProps {
  eventId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const fetchEventDetail = async (id: number) => {
    const { data } = await organizerApi.get(`/events/${id}`);
    return data;
};

const DetailEventView: React.FC<DetailEventViewProps> = ({ eventId, onBack, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: event, isLoading, isError, error } = useQuery({
      queryKey: ['organizerEventDetail', eventId],
      queryFn: () => fetchEventDetail(eventId),
      enabled: !!eventId,
  });

  const renderContent = () => {
    if (isLoading) return <p className="text-center p-4">Memuat data event...</p>;
    if (isError) return <p className="text-center p-4 text-red-500">Gagal memuat data: {error.message}</p>;
    if (!event) return null;

    switch (activeTab) {
      case 'Overview': return <OverviewTab event={event} />;
      case 'Partisipan': return <PartisipanTab eventId={eventId} />;
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
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => onEdit(eventId)} className="bg-[#1A3A53] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90">
                    Edit Event
                </button>
                <button onClick={() => onDelete(eventId)} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700">
                    Hapus Event
                </button>
            </div>
        </div>
        <DetailEventTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>{renderContent()}</div>
    </div>
  );
};
export default DetailEventView;
