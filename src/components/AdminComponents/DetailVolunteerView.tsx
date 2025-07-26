import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '../../API/admin';
import { ArrowLeft, Calendar, Mail, Activity, TrendingUp, Camera } from 'lucide-react';

interface DetailVolunteerViewProps {
  onBack: () => void;
  volunteerId: number;
}

const fetchVolunteerDetail = async (id: number) => {
    const { data } = await adminApi.get(`/volunteer/${id}`);
    return data;
};

const EventItemCard = ({ title, date, hours }) => (
    <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
        <div>
            <p className="font-semibold text-sm text-[#1A3A53]">{title}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Calendar size={14} /><span>{date}</span>
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

    const { profile, stats, upcomingEvents, completedEvents } = data;

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
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4 flex items-center gap-2"><TrendingUp size={20}/> Event Terbaru yang Diikuti</h2>
                        <div className="space-y-3">
                            {completedEvents.length > 0 ? completedEvents.map((event: any, index: number) => <EventItemCard key={index} title={event.title} date={event.date} hours="N/A" />) : <p className="text-sm text-gray-500">Belum ada event yang diikuti.</p>}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4 flex items-center gap-2"><Calendar size={20}/> Event Mendatang</h2>
                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? upcomingEvents.map((event: any, index: number) => <EventItemCard key={index} title={event.title} date={event.date} hours="N/A" />) : <p className="text-sm text-gray-500">Tidak ada event mendatang.</p>}
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