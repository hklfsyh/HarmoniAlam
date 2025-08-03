import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Mail, X, Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../../API/admin';

const fetchVolunteers = async (search: string = "") => {
    const endpoint = search ? `/volunteer?search=${encodeURIComponent(search)}` : '/volunteer';
    const { data } = await adminApi.get(endpoint);
    return data;
};

interface Volunteer {
    volunteer_id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    totalEventsParticipated: number;
}

interface VolunteersTabProps {
    onViewClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
    onSendEmailClick: (volunteer: Volunteer) => void;
}

const VolunteersTab: React.FC<VolunteersTabProps> = ({ onViewClick, onDeleteClick, onSendEmailClick }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); // Reset to first page when search changes
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: volunteersRaw, isLoading, isError, error } = useQuery({
        queryKey: ['volunteers', debouncedSearch],
        queryFn: () => fetchVolunteers(debouncedSearch),
    });
    
    const volunteers: Volunteer[] = Array.isArray(volunteersRaw) ? volunteersRaw : [];

    // Pagination logic
    const totalPages = Math.ceil(volunteers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVolunteers = volunteers.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index && item !== 1 || index === 0);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama Volunteer..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border rounded-lg"
                />
            </div>
            <h2 className="text-2xl font-normal text-[#1A3A53] mb-4">Manajemen Volunteers</h2>

            {isLoading && <p>Memuat data volunteers...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            {/* Responsive table container with horizontal scroll */}
            <div className="border rounded-lg text-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]"> {/* Minimum width to maintain table structure */}
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-4 py-3 bg-[#1A3A53] text-white font-normal uppercase tracking-wider text-xs">
                            <div className="col-span-3">Nama</div>
                            <div className="col-span-4">Email</div>
                            <div className="col-span-2">Tgl Bergabung</div>
                            <div className="col-span-1">Event Diikuti</div>
                            <div className="col-span-2 text-right">Aksi</div>
                        </div>

                        {/* Body */}
                        <div className="divide-y divide-gray-100">
                            {currentVolunteers.length > 0 ? (
                                currentVolunteers.map((volunteer: Volunteer) => (
                                    <div key={volunteer.volunteer_id} className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-4 py-3 items-center">
                                        <div className="col-span-3 font-normal text-[#1A3A53] truncate" title={`${volunteer.firstName} ${volunteer.lastName}`}>
                                            {volunteer.firstName} {volunteer.lastName}
                                        </div>
                                        <div className="col-span-4 text-gray-700 truncate" title={volunteer.email}>
                                            {volunteer.email}
                                        </div>
                                        <div className="col-span-2 text-gray-500 flex items-center gap-1 sm:gap-2">
                                            <Calendar size={16} />
                                            <span className="truncate">
                                                {new Date(volunteer.createdAt).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-gray-500 font-normal text-center">
                                            {volunteer.totalEventsParticipated}
                                        </div>
                                        <div className="col-span-2 flex items-center justify-end gap-1 sm:gap-2 text-gray-500">
                                            <button 
                                                onClick={() => onSendEmailClick(volunteer)} 
                                                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors" 
                                                title="Kirim Email"
                                            >
                                                <Mail size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onViewClick(volunteer.volunteer_id)} 
                                                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onDeleteClick(volunteer.volunteer_id)} 
                                                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"
                                                title="Hapus"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {search ? `Tidak ada volunteer ditemukan untuk "${search}".` : "Tidak ada volunteer ditemukan."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {volunteers.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Menampilkan {startIndex + 1}-{Math.min(endIndex, volunteers.length)} dari {volunteers.length} volunteer
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {getVisiblePages().map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page === '...' ? (
                                            <span className="px-3 py-2 text-gray-500">...</span>
                                        ) : (
                                            <button
                                                onClick={() => goToPage(page as number)}
                                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-[#1A3A53] text-white'
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VolunteersTab;