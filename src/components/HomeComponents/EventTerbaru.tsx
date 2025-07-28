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
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1A3A53]">Event Terbaru</h2>
                    <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                        Temukan event kebersihan lingkungan di sekitar Anda dan berpartisipasilah untuk masa depan yang lebih hijau
                    </p>
                </div>

                {isLoading && <p className="text-center">Memuat event terbaru...</p>}
                {isError && <p className="text-center text-red-500">Gagal memuat event: {error.message}</p>}

                {Array.isArray(events) && events.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-8">
                    {events.slice(0, 3).map((event: any) => (
                      <div key={event.event_id} className="w-full md:w-1/2 lg:w-[30%] rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col bg-white">
                        <div className="relative">
                          <img src={event.image} alt={event.title} className="w-full h-56 object-cover" />
                          <div className="absolute top-4 right-4 bg-[#1A3A53] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {event.category?.categoryName ?? '-'}
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-2xl font-bold text-[#1A3A53] mb-4 flex-grow">{event.title}</h3>
                          <div className="flex items-center gap-2 text-gray-700 mb-6">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <span>{formatDate(event.eventDate)}</span>
                          </div>
                          <Link
                            to={`/event/detail/${event.event_id}`}
                            className="mt-auto w-full text-center bg-[#1A3A53] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                          >
                            Lihat Detail
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center mt-12">
                    <Link to="/event" className="inline-flex items-center gap-2 px-6 py-3 border border-[#79B829] text-[#79B829] font-semibold rounded-lg hover:bg-[#79B829] hover:text-white transition-colors">
                        Lihat Semua Event
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default EventTerbaru;
