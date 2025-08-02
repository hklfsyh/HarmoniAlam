// src/pages/DetailEvent.tsx

import React from "react";
// 1. Impor Link dan ArrowLeft
import {  useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import publicApi from "../API/publicApi";
import EventHeader from "../components/DetailEventComponents/EventHeader";
import EventDescription from "../components/DetailEventComponents/EventDescription";
import EventRequirements from "../components/DetailEventComponents/EventRequirements";
import EventSidebar from "../components/DetailEventComponents/EventSidebar";
import OrganizerCard from "../components/DetailEventComponents/EventOrganizerCard";
import EventGallery from "../components/DetailEventComponents/EventGallery";

const fetchEventDetail = async (id: string) => {
  const { data } = await publicApi.get(`/events/${id}`);
  return data;
};

const DetailEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["publicEventDetail", eventId],
    queryFn: () => fetchEventDetail(eventId!),
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Memuat detail event...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Gagal memuat data: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <main className="container mx-auto py-12 px-6 mt-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-normal mb-6"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Bagian Kiri (Konten Utama) */}
          <div className="lg:col-span-2">
            <EventHeader event={event} />
            <EventDescription event={event} />
            <EventRequirements event={event} />
          </div>
          {/* Bagian Kanan (Sidebar) */}
          <div className="flex flex-col gap-8 sticky top-28 h-fit">
            <EventSidebar event={event} />
            <OrganizerCard event={event} />
          </div>
        </div>
        {event.gallery && event.gallery.length > 0 && (
          <EventGallery gallery={event.gallery.map((img: any) => typeof img === 'string' ? img : img.url)} />
        )}
      </main>
    </div>
  );
};

export default DetailEventPage;
