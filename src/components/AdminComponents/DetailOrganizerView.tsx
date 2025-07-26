import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '../../API/admin';
import { ArrowLeft, Calendar,  Mail, Phone, MapPin, Globe,  Link as LinkIcon, Camera } from 'lucide-react';

interface DetailOrganizerViewProps {
  onBack: () => void;
  organizerId: number;
}

const fetchOrganizerDetail = async (id: number) => {
    const { data } = await adminApi.get(`/organizer/${id}`);
    return data;
};

const DetailOrganizerView: React.FC<DetailOrganizerViewProps> = ({ onBack, organizerId }) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['organizerDetail', organizerId],
        queryFn: () => fetchOrganizerDetail(organizerId),
        enabled: !!organizerId,
    });

    if (isLoading) return <div className="p-8 text-center">Memuat detail organizer...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Terjadi kesalahan: {error.message}</div>;

    const { profile, stats, upcomingEvents, completedEvents } = data;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4">
                <ArrowLeft size={20} />
                Kembali ke Dashboard
            </button>
            <h1 className="text-3xl font-bold text-[#1A3A53]">Detail Organizer</h1>
            <p className="mt-1 text-gray-500 mb-8">Informasi lengkap organizer dan aktivitasnya</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg"><p className="text-gray-500">Total Event</p><p className="text-3xl font-bold">{stats.totalEventsCreated}</p></div>
                        <div className="flex justify-between items-center p-4 border rounded-lg"><p className="text-gray-500">Volunteers</p><p className="text-3xl font-bold">{stats.totalAllParticipants}</p></div>
                    </div>

                    <div className="border p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Organisasi</h2>
                        <div className="flex items-start gap-4">
                            {profile.profilePicture ? (
                                <img src={profile.profilePicture} alt={profile.orgName} className="h-24 w-24 rounded-lg object-cover" />
                            ) : (
                                <div className="h-24 w-24 rounded-lg bg-slate-200 flex items-center justify-center"><Camera size={40} className="text-slate-400" /></div>
                            )}
                            <div>
                                <h3 className="font-bold text-lg">{profile.orgName}</h3>
                                <p className="text-sm text-gray-600">{profile.orgDescription}</p>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline"><Globe size={16}/><span>Website</span></a>
                            <a href={profile.documentPath} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline"><LinkIcon size={16}/><span>Lihat Dokumen</span></a>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Event Terbaru</h2>
                        <div className="border rounded-lg text-sm divide-y">
                            <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-slate-50 font-semibold text-gray-500">
                                <div className="col-span-2">Event</div><div>Lokasi</div><div>Partisipan</div><div>Status</div>
                            </div>
                            {completedEvents.length > 0 ? completedEvents.map(event => <div key={event.id}>...</div>) : <p className="p-4 text-gray-500">Tidak ada event selesai.</p>}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="border p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Informasi Kontak</h2>
                        <div className="space-y-4 text-sm">
                            <div><p className="text-xs">Nama Pemohon</p><p className="font-semibold">{profile.responsiblePerson}</p></div>
                            <div><p className="text-xs">Email</p><p className="text-green-600 flex items-center gap-2 break-all"><Mail size={14}/>{profile.email}</p></div>
                            <div><p className="text-xs">Telepon</p><p className="flex items-center gap-2"><Phone size={14}/>{profile.phoneNumber}</p></div>
                            <div><p className="text-xs">Alamat</p><p className="flex items-start gap-2"><MapPin size={14} className="flex-shrink-0 mt-0.5"/><span>{profile.orgAddress}</span></p></div>
                        </div>
                    </div>
                     <div className="border p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Statistik Bergabung</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2"><Calendar size={14}/>Bergabung Sejak: <strong>{new Date(profile.approvedAt).toLocaleDateString('id-ID')}</strong></div>
                            <div className="flex justify-between"><span>Event Selesai</span><strong>{completedEvents.length}</strong></div>
                            <div className="flex justify-between"><span>Event Mendatang</span><strong>{upcomingEvents.length}</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DetailOrganizerView;
