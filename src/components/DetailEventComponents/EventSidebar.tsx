// src/components/DetailEventComponents/EventSidebar.tsx

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import volunteerApi from "../../API/volunteer";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const registerForEvent = (eventId: number) => {
  return volunteerApi.post(`/events/${eventId}/register`);
};

// Perbaiki API cancel: gunakan DELETE ke /events/:id/register
const cancelRegistration = (eventId: number) => {
  return volunteerApi.delete(`/events/${eventId}/register`);
};

const fetchMyRegisteredEvents = async () => {
  const { data } = await volunteerApi.get('/events/my-registered-events');
  return data;
};

const EventSidebar: React.FC<{ event: any }> = ({ event }) => {
  const { user, requireLogin } = useAuth();
  const queryClient = useQueryClient();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Berhasil");
  const [modalButtonText, setModalButtonText] = useState("Tutup");

  // Cek apakah user sudah daftar event ini
  const { data: myEvents } = useQuery({
    queryKey: ['myRegisteredEvents'],
    queryFn: fetchMyRegisteredEvents,
    enabled: !!user && user.role === 'volunteer',
  });

  const isRegistered = Array.isArray(myEvents) && myEvents.some((e: any) => e.event_id === event.event_id);

  // Mutasi daftar event
  const registerMutation = useMutation({
    mutationFn: (eventId: number) => registerForEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicEvents'] });
      queryClient.invalidateQueries({ queryKey: ['publicEventDetail', String(event.event_id)] });
      queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
      setModalTitle("Berhasil Daftar");
      setModalMessage("Pendaftaran berhasil! Terima kasih atas partisipasi Anda.");
      setModalButtonText("Selesai");
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      setModalTitle("Gagal Daftar");
      setModalMessage(error?.response?.data?.message || "Terjadi kesalahan saat mendaftar.");
      setModalButtonText("Coba Lagi");
      setIsErrorModalOpen(true);
    }
  });

  // Mutasi batal event
  const cancelMutation = useMutation({
    mutationFn: (eventId: number) => cancelRegistration(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicEvents'] });
      queryClient.invalidateQueries({ queryKey: ['publicEventDetail', String(event.event_id)] });
      queryClient.invalidateQueries({ queryKey: ['myRegisteredEvents'] });
      setModalTitle("Pendaftaran Dibatalkan");
      setModalMessage("Pendaftaran berhasil dibatalkan.");
      setModalButtonText("Selesai");
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      setModalTitle("Gagal Membatalkan");
      setModalMessage(error?.response?.data?.message || "Terjadi kesalahan saat membatalkan pendaftaran.");
      setModalButtonText("Coba Lagi");
      setIsErrorModalOpen(true);
    }
  });

  const handleRegisterClick = () => {
    if (!user) {
      requireLogin();
      return;
    }
    if (user.role !== 'volunteer') {
      setModalTitle("Gagal");
      setModalMessage("Hanya volunteer yang dapat mendaftar atau membatalkan pendaftaran event.");
      setModalButtonText("Tutup");
      setIsErrorModalOpen(true);
      return;
    }
    if (isRegistered) {
      cancelMutation.mutate(Number(event.event_id));
    } else {
      registerMutation.mutate(Number(event.event_id));
    }
  };

  if (!event) return null;

  const progressPercentage =
    (event.currentParticipants / event.maxParticipants) * 100;

  let buttonLabel = isRegistered ? 'Batal' : 'Daftar Event';
  if (registerMutation.isPending || cancelMutation.isPending) {
    buttonLabel = 'Memproses...';
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-normal text-[#1A3A53] mb-4">
          Bergabung dengan Event
        </h2>
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="font-light">Peserta Terdaftar</span>
            <span>
              {event.currentParticipants}/{event.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#79B829] h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={handleRegisterClick}
          disabled={registerMutation.isPending || cancelMutation.isPending}
          className={`w-full py-3 rounded-lg font-normal transition-all
            ${isRegistered
              ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
              : 'bg-[#79B829] text-white hover:bg-opacity-90'}
            disabled:bg-gray-200 disabled:cursor-not-allowed`}
        >
          {buttonLabel}
        </button>

        {/* Tambahkan tombol lokasi event */}
        {event.latitude && event.longitude && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-4 py-3 rounded-lg bg-[#1A3A53] text-white text-center font-normal hover:bg-[#254b6b] transition"
          >
            Lihat Lokasi Event di Google Maps
          </a>
        )}
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        buttonText={modalButtonText}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        buttonText={modalButtonText}
      />
    </>
  );
};

export default EventSidebar;
