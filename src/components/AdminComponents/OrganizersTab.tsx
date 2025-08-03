import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Mail, X, Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../../API/admin';

const fetchOrganizers = async (search: string = "") => {
    const endpoint = search ? `/organizer?search=${encodeURIComponent(search)}` : '/organizer';
    const { data } = await adminApi.get(endpoint);
    return Array.isArray(data) ? data : [data];
};

// Tipe data untuk organizer
interface Organizer {
    organizer_id: number;
    orgName: string;
    website: string;
    responsiblePerson: string;
    email: string;
    approvedAt: string;
    totalEvents: number;
}

interface OrganizersTabProps {
    onViewClick: (id: number) => void;
    onSendEmailClick: (organizer: Organizer) => void;
    onDeleteClick: (id: number) => void;
}

const OrganizersTab: React.FC<OrganizersTabProps> = ({ onViewClick, onSendEmailClick, onDeleteClick }) => {
    const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); // Reset to first page when searching
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: organizersRaw, isLoading, isError, error } = useQuery({
        queryKey: ['organizers', debouncedSearch],
        queryFn: () => fetchOrganizers(debouncedSearch),
    });
    
    const organizers: Organizer[] = Array.isArray(organizersRaw) ? organizersRaw : [];

    // Pagination logic
    const totalPages = Math.ceil(organizers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrganizers = organizers.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20}/>
                <input
                    type="text"
                    placeholder="Cari nama organisasi......."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm placeholder:text-gray-400 text-base"
                    style={{ boxShadow: '0 2px 8px rgba(26,58,83,0.06)' }}
                />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A3A53] mb-4">Manajemen Organizers</h2>

            {isLoading && <p>Memuat data organizers...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            {/* Responsive table container with horizontal scroll */}
            <div className="border rounded-lg text-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]"> {/* Minimum width to maintain table structure */}
                        {/* Table header */}
                        <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-3 sm:px-4 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                            <div className="col-span-3">Organisasi</div>
                            <div className="col-span-2">Organizer</div>
                            <div className="col-span-3">Email</div>
                            <div className="col-span-1 text-center">Total Event</div>
                            <div className="col-span-2">Bergabung</div>
                            <div className="col-span-1 text-right">Aksi</div>
                        </div>
                        
                        {/* Table body */}
                        <div className="divide-y divide-gray-100">
                            {currentOrganizers.length > 0 ? (
                                currentOrganizers.map((org: Organizer) => (
                                    <div key={org.organizer_id} className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-3 sm:px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                                        <div className="col-span-3">
                                            <p className="font-bold text-[#1A3A53] text-sm truncate" title={org.orgName}>{org.orgName}</p>
                                            <a 
                                                href={org.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-xs text-blue-500 hover:underline truncate block" 
                                                title={org.website}
                                            >
                                                {org.website}
                                            </a>
                                        </div>
                                        <div className="col-span-2 text-gray-700 text-sm truncate" title={org.responsiblePerson}>
                                            {org.responsiblePerson}
                                        </div>
                                        <div className="col-span-3 text-gray-500 text-sm truncate" title={org.email}>
                                            {org.email}
                                        </div>
                                        <div className="col-span-1 font-medium text-center text-sm">
                                            {org.totalEvents}
                                        </div>
                                        <div className="col-span-2 text-gray-500 flex items-center gap-1 text-sm">
                                            <Calendar size={14}/>
                                            <span className="truncate">
                                                {new Date(org.approvedAt).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex items-center justify-end gap-1 text-gray-500">
                                            <button 
                                                onClick={() => onViewClick(org.organizer_id)} 
                                                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => onSendEmailClick(org)} 
                                                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors" 
                                                title="Kirim Email"
                                            >
                                                <Mail size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => onDeleteClick(org.organizer_id)} 
                                                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"
                                                title="Hapus"
                                            >
                                                <X size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {search ? 'Tidak ada organizer yang sesuai dengan pencarian.' : 'Tidak ada organizer ditemukan.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {organizers.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                    {/* Info */}
                    <div className="text-sm text-gray-600">
                        Menampilkan {startIndex + 1}-{Math.min(endIndex, organizers.length)} dari {organizers.length} organizer
                    </div>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Show first page, last page, current page, and pages around current page
                                    const showPage = 
                                        page === 1 || 
                                        page === totalPages || 
                                        Math.abs(page - currentPage) <= 1;

                                    if (!showPage) {
                                        // Show ellipsis for gaps
                                        if (page === 2 && currentPage > 4) {
                                            return <span key={page} className="px-2 py-1 text-gray-400">...</span>;
                                        }
                                        if (page === totalPages - 1 && currentPage < totalPages - 3) {
                                            return <span key={page} className="px-2 py-1 text-gray-400">...</span>;
                                        }
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                                currentPage === page
                                                    ? 'bg-[#1A3A53] text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrganizersTab;