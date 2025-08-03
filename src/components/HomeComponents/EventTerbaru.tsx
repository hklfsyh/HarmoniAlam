import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import publicApi from '../../API/publicApi';

// Fungsi untuk mengambil data event terbaru dari API
const fetchLatestEvents = async () => {
    const { data } = await publicApi.get('/events/latest');
    return data;
};

const EventTerbaru: React.FC = () => {
    const { data: events, isLoading, isError, error } = useQuery({
        queryKey: ['latestEvents'],
        queryFn: fetchLatestEvents,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    return (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#1A3A53]">
                        Event Terbaru
                    </h2>
                    <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-4 sm:px-0">
                        Temukan event kebersihan lingkungan di sekitar Anda dan berpartisipasilah untuk masa depan yang lebih hijau
                    </p>
                </div>

                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3A53]"></div>
                        <p className="mt-2 text-gray-600">Memuat event terbaru...</p>
                    </div>
                )}
                
                {isError && (
                    <p className="text-center text-red-500 py-8">
                        Gagal memuat event: {error.message}
                    </p>
                )}

                {Array.isArray(events) && events.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {events.slice(0, 3).map((event: any) => (
                      <div key={event.event_id} className="rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col bg-white">
                        <div className="relative">
                          <img src={event.image} alt={event.title} className="w-full h-48 sm:h-56 object-cover" />
                          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#1A3A53] text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-light">
                            {event.category?.categoryName ?? '-'}
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 flex flex-col flex-grow">
                          <h3 className="text-lg sm:text-xl lg:text-2xl text-[#1A3A53] mb-3 sm:mb-4 flex-grow font-normal line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-700 mb-4 sm:mb-6 font-light">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base">{formatDate(event.eventDate)}</span>
                          </div>
                          <Link
                            to={`/event/detail/${event.event_id}`}
                            className="mt-auto w-full text-center bg-[#1A3A53] text-white font-normal py-2.5 sm:py-3 rounded-lg hover:bg-opacity-90 transition-colors text-sm sm:text-base"
                          >
                            Lihat Detail
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center mt-8 sm:mt-10 lg:mt-12">
                    <Link 
                        to="/event" 
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-[#79B829] text-[#79B829] font-normal rounded-lg hover:bg-[#79B829] hover:text-white transition-colors text-sm sm:text-base"
                    >
                        Lihat Semua Event
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default EventTerbaru;
