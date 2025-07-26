import React from 'react';
import { useQuery } from '@tanstack/react-query';
import EventCard from './EventCard';
import publicApi from '../../API/publicApi';

// Fungsi untuk mengambil data event dari API
const fetchEvents = async () => {
    const { data } = await publicApi.get('/events');
    return data;
};

interface EventListProps {
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
}

const EventList: React.FC<EventListProps> = ({ onSuccess, onFailure }) => {
    const { data: events, isLoading, isError, error } = useQuery({
        queryKey: ['publicEvents'],
        queryFn: fetchEvents,
    });

    return (
        <div className="container mx-auto py-12 px-6">
            <h2 className="text-3xl font-bold text-center text-[#1A3A53] mb-10">Daftar Event Mendatang</h2>
            
            {isLoading && <p className="text-center">Memuat event...</p>}
            {isError && <p className="text-center text-red-500">Gagal memuat event: {error.message}</p>}

            {events && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event: any) => (
                        <EventCard 
                            key={event.event_id} 
                            event={event} 
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;