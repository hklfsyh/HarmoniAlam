import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";
import publicApi from "../../API/publicApi";

// Tipe data untuk sebuah Event
interface Event {
  event_id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  participants: string;
  categoryName: string;
  image: string;
}

// Fungsi untuk mengambil data event dari API dengan filter
const fetchEvents = async (
  searchTerm: string,
  categoryId: number | null
): Promise<Event[]> => {
  const params = new URLSearchParams();
  if (searchTerm) params.append("search", searchTerm);
  if (categoryId) params.append("category", String(categoryId));
  const { data } = await publicApi.get(`/events?${params.toString()}`);
  return data as Event[];
};

interface EventListProps {
  searchTerm: string;
  selectedCategory: number | null;
  onFailure: (message: string) => void;
  onCancelClick: (event: Event) => void;
  onRegisterClick: (event: Event) => void;
  isRegistering: boolean;
}

const EventList: React.FC<EventListProps> = ({
  searchTerm,
  selectedCategory,
  onFailure,
  onCancelClick,
  onRegisterClick,
  isRegistering,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery<Event[], Error>({
    queryKey: ["publicEvents", searchTerm, selectedCategory],
    queryFn: () => fetchEvents(searchTerm, selectedCategory),
  });

  // Reset pagination when search/filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination logic
  const totalItems = events?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of event list
    document.getElementById('event-list')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div id="event-list" className="container mx-auto py-12 px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-normal text-center text-[#1A3A53] mb-8 sm:mb-10">
        Daftar Event Mendatang
      </h2>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3A53]"></div>
          <p className="mt-2 text-gray-600">Mencari event...</p>
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500 py-8">
          Gagal memuat event: {error.message}
        </p>
      )}

      {events && (
        <>
          {currentEvents.length > 0 ? (
            <>
              {/* Event Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {currentEvents.map((event) => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    onFailure={onFailure}
                    onCancelClick={onCancelClick}
                    onRegisterClick={onRegisterClick}
                    isRegistering={isRegistering}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  {/* Info halaman - Mobile di atas, Desktop di kiri */}
                  <div className="text-sm text-gray-600 order-2 sm:order-1">
                    Menampilkan {startIndex + 1}-{Math.min(endIndex, totalItems)} dari {totalItems} event
                  </div>

                  {/* Pagination controls - Mobile di bawah, Desktop di kanan */}
                  <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                    {/* Previous button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {generatePageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="px-2 py-1 text-gray-400 text-sm">...</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(page as number)}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-[#1A3A53] text-white'
                                  : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-normal text-gray-700 mb-2">
                  Tidak Ada Event yang Ditemukan
                </h3>
                <p className="text-gray-500 text-sm sm:text-base font-light">
                  Coba gunakan kata kunci atau filter yang berbeda.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;
