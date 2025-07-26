import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import publicApi from '../API/publicApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventHeader from '../components/DetailEventComponents/EventHeader';
import EventDescription from '../components/DetailEventComponents/EventDescription';
import EventRequirements from '../components/DetailEventComponents/EventRequirements';
import EventSidebar from '../components/DetailEventComponents/EventSidebar';

const fetchEventDetail = async (id: string) => {
    const { data } = await publicApi.get(`/events/${id}`);
    return data;
};

const DetailEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const { data: event, isLoading, isError, error } = useQuery({
      queryKey: ['publicEventDetail', eventId],
      queryFn: () => fetchEventDetail(eventId!),
      enabled: !!eventId,
  });

  if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Memuat detail event...</div>;
  }

  if (isError) {
      return <div className="flex justify-center items-center h-screen text-red-500">Gagal memuat data: {error.message}</div>;
  }

  return (
    <div className="bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-12 px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <EventHeader event={event} />
            <EventDescription event={event} />
            <EventRequirements event={event} />
          </div>
          <div>
            <EventSidebar event={event} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetailEventPage;
