import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '../../API/admin';
import { ArrowLeft, Building2, FileText, Mail, Phone, MapPin, Calendar, Globe, Link as LinkIcon } from 'lucide-react';

interface DetailPengajuanViewProps {
  onBack: () => void;
  organizerId: number;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const fetchSubmissionDetail = async (id: number) => {
    const { data } = await adminApi.get(`/organizer/${id}`);
    return data;
};

const DetailPengajuanView: React.FC<DetailPengajuanViewProps> = ({ onBack, organizerId, onApprove, onReject }) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['submissionDetail', organizerId],
        queryFn: () => fetchSubmissionDetail(organizerId),
        enabled: !!organizerId,
    });

    if (isLoading) return <div className="p-8 text-center">Memuat detail pengajuan...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Terjadi kesalahan: {error.message}</div>;

    const { profile } = data;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4">
                <ArrowLeft size={20} />
                Kembali ke Dashboard
            </button>
            <h1 className="text-3xl font-bold text-[#1A3A53]">Detail Pengajuan Organizer</h1>
            <p className="mt-1 text-gray-500 mb-8">{profile.orgName}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="border p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4"><Building2 className="text-[#1A3A53]" /><h2 className="text-xl font-bold text-[#1A3A53]">Informasi Organisasi</h2></div>
                        <div className="space-y-3"><h3 className="font-bold text-lg">{profile.orgName}</h3><p className="text-sm text-gray-600">{profile.orgDescription}</p></div>
                        <hr className="my-4" />
                        <div className="flex justify-between text-sm">
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline"><Globe size={16} /><span>{profile.website}</span></a>
                        </div>
                    </div>
                    <div className="border p-6 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-3 mb-4"><FileText className="text-[#1A3A53]" /><h2 className="text-xl font-bold text-[#1A3A53]">Dokumen Pendukung</h2></div>
                        <a href={profile.documentPath} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-blue-600 hover:text-blue-800 p-8">
                            <LinkIcon size={64} />
                            <p className="mt-2 text-sm">Lihat Dokumen</p>
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="border p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Kontak</h2>
                        <div className="space-y-4 text-sm">
                            <div><p className="text-xs text-gray-500">Nama Pemohon</p><p className="font-semibold">{profile.responsiblePerson}</p></div>
                            <div><p className="text-xs text-gray-500">Email</p><p className="text-green-600 flex items-center gap-2 break-all"><Mail size={14} />{profile.email}</p></div>
                            <div><p className="text-xs text-gray-500">Telepon</p><p className="flex items-center gap-2"><Phone size={14} />{profile.phoneNumber}</p></div>
                            <div><p className="text-xs text-gray-500">Alamat</p><p className="flex items-start gap-2"><MapPin size={14} className="flex-shrink-0 mt-0.5" /><span>{profile.orgAddress}</span></p></div>
                        </div>
                    </div>
                    
                    <div className="border p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-[#1A3A53] mb-4">Informasi Pengajuan</h2>
                        <div className="flex items-center gap-2 mb-6"><Calendar size={16} /><span>Tgl Pengajuan: <strong>{new Date(profile.createdAt).toLocaleDateString('id-ID')}</strong></span></div>
                        {profile.status === 'pending' && (
                            <div className="space-y-3">
                                <button onClick={() => onApprove(organizerId)} className="w-full bg-[#79B829] text-white font-bold py-2.5 rounded-lg hover:bg-opacity-90">Setujui Pengajuan</button>
                                <button onClick={() => onReject(organizerId)} className="w-full border border-red-500 text-red-500 font-bold py-2.5 rounded-lg hover:bg-red-50">Tolak Pengajuan</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPengajuanView;
