import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '../../API/admin';
import { ArrowLeft, Calendar, Mail, Camera } from 'lucide-react';

interface DetailVolunteerViewProps {
  onBack: () => void;
  volunteerId: number;
}

const fetchVolunteerDetail = async (id: number) => {
    const { data } = await adminApi.get(`/volunteer/${id}`);
    return data;
};

const getEventStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'upcoming':
            return 'bg-blue-100 text-blue-700';
        case 'completed':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const EventItemCard = ({ title, date, hours, status }: { title: string; date: string; hours: string; status: string }) => (
    <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
        <div>
            <p className="font-semibold text-sm text-[#1A3A53]">{title}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Calendar size={14} /><span>{date}</span>
                {status && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getEventStatusStyles(status)}`}>{status}</span>
                )}
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs text-gray-500">Jam Volunteer</p>
            <p className="font-semibold text-green-600">{hours}</p>
        </div>
    </div>
);

const DetailVolunteerView: React.FC<DetailVolunteerViewProps> = ({ onBack, volunteerId }) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['volunteerDetail', volunteerId],
        queryFn: () => fetchVolunteerDetail(volunteerId),
        enabled: !!volunteerId,
    });

    if (isLoading) return <div className="p-8 text-center">Memuat detail volunteer...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Terjadi kesalahan: {error.message}</div>;

    const { profile, stats, registeredEvents } = data;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4">
                <ArrowLeft size={20} />
                Kembali ke Dashboard
            </button>
            <h1 className="text-3xl font-bold text-[#1A3A53]">Detail Volunteer</h1>
            <p className="mt-1 text-gray-500 mb-8">Informasi lengkap volunteer</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                        <div><p className="text-gray-500">Total Event Diikuti</p><p className="text-3xl font-bold">{stats.totalEventsParticipated}</p></div>
                        <Calendar size={32} className="text-gray-400"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4 flex items-center gap-2"><Calendar size={20}/> Event Yang Diikuti</h2>
                        <div className="space-y-3">
                            {Array.isArray(registeredEvents) && registeredEvents.length > 0 ? (
                                registeredEvents.map((event: any) => (
                                    <EventItemCard
                                        key={event.event_id}
                                        title={event.title}
                                        date={event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 10) : ''}
                                        hours={event.eventTime ? new Date(event.eventTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                                        status={event.status}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Tidak ada event terdaftar.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="border p-6 rounded-lg h-full">
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Personal</h2>
                        <div className="flex flex-col items-center mb-4">
                            {profile.profilePicture ? (
                                <img src={profile.profilePicture} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center"><Camera size={40} className="text-slate-400" /></div>
                            )}
                        </div>
                        <div className="space-y-4 text-sm">
                            <div><p className="text-xs text-gray-500">Nama Lengkap</p><p className="font-semibold text-lg">{profile.firstName} {profile.lastName}</p></div>
                            <div><p className="text-xs text-gray-500">Email</p><p className="text-green-600 flex items-center gap-2 break-all"><Mail size={14} />{profile.email}</p></div>
                            <div><p className="text-xs text-gray-500">Bergabung Sejak</p><p className="flex items-center gap-2"><Calendar size={14} />{new Date(profile.createdAt).toLocaleDateString('id-ID')}</p></div>
                            {/* Aktivitas Terakhir tidak tersedia di API detail, bisa ditambahkan nanti */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DetailVolunteerView;