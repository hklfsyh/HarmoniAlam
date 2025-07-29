// Tipe data untuk pengajuan organizer
interface OrganizerSubmission {
    organizer_id: number;
    responsiblePerson: string;
    orgName: string;
    phoneNumber: string;
    createdAt: string;
    status: string;
    isVerified: boolean;
}
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Check, X, Search } from 'lucide-react';
import adminApi from '../../API/admin';

const fetchSubmissions = async (search: string = "", status: string = "") => {
    let endpoint = '/organizer/submissions';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    const { data } = await adminApi.get(endpoint);
    return data;
};

const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'approved': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

interface PengajuanOrganizerTabProps {
    onViewClick: (id: number) => void;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

const PengajuanOrganizerTab: React.FC<PengajuanOrganizerTabProps> = ({ onViewClick, onApprove, onReject }) => {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: submissionsRaw, isLoading, isError, error } = useQuery({
        queryKey: ['organizerSubmissions', debouncedSearch, status],
        queryFn: () => fetchSubmissions(debouncedSearch, status),
    });
    // Make sure submissions is always an array
    const submissions: OrganizerSubmission[] = Array.isArray(submissionsRaw) ? submissionsRaw : [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama Organizer......."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm placeholder:text-gray-400 text-base"
                        style={{ boxShadow: '0 2px 8px rgba(26,58,83,0.06)' }}
                    />
                </div>
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="font-light py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-gray-700 bg-white shadow-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <h2 className="text-2xl font-normal text-[#1A3A53] mb-4">Pengajuan Organizer</h2>

            {isLoading && <p>Memuat data...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            <div className="border rounded-lg text-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1A3A53] text-white font-normal uppercase tracking-wider text-xs">
                    <div className="col-span-2">Pemohon</div>
                    <div className="col-span-2">Organisasi</div>
                    <div className="col-span-2">Kontak</div>
                    <div className="col-span-2">Tgl Pengajuan</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Verifikasi</div>
                    <div className="col-span-2 text-right">Aksi</div>
                </div>
                <div className="divide-y divide-gray-100">
                    {submissions.length > 0 ? (
                        submissions.map((submission: OrganizerSubmission) => (
                            <div key={submission.organizer_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center font-normal">
                                <div className="col-span-2 text-[#1A3A53]">{submission.responsiblePerson}</div>
                                <div className="col-span-2 text-gray-700">{submission.orgName}</div>
                                <div className="col-span-2 text-gray-500">{submission.phoneNumber}</div>
                                <div className="col-span-2 text-gray-500">{new Date(submission.createdAt).toLocaleDateString('id-ID')}</div>
                                <div className="col-span-1 text-center">
                                    <span className={`text-xs font-normal px-3 py-1 rounded-full ${getStatusStyles(submission.status)}`}>
                                        {submission.status}
                                    </span>
                                </div>
                                <div className="col-span-1 text-center font-normal">
                                    <span className={`text-xs px-3 py-1 rounded-full ${submission.isVerified ? 'bg-green-100 text-[#79B829]' : 'bg-gray-100 text-gray-600'}`}>
                                        {submission.isVerified ? 'Terverifikasi' : 'Belum'}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-2 text-gray-500 font-normal">
                                    <button onClick={() => onViewClick(submission.organizer_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                                    {submission.status === 'pending' && (
                                        <>
                                            <button onClick={() => onApprove(submission.organizer_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"><Check size={18} /></button>
                                            <button onClick={() => onReject(submission.organizer_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"><X size={18} /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">Tidak ada pengajuan organizer ditemukan.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PengajuanOrganizerTab;
