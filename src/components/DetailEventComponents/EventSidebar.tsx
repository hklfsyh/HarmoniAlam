// src/components/DetailEventComponents/EventSidebar.tsx

import React from "react";
import { useAuth } from "../../context/AuthContext";

const EventSidebar: React.FC<{ event: any }> = ({ event }) => {
  const { user, requireLogin } = useAuth();

  const handleRegisterClick = () => {
    if (user) {
      alert("Anda berhasil mendaftar untuk event ini!");
    } else {
      requireLogin();
    }
  };

  if (!event) return null;

  const progressPercentage =
    (event.currentParticipants / event.maxParticipants) * 100;

  return (
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
        className="w-full bg-[#79B829] text-white font-normal py-3 rounded-lg hover:bg-opacity-90 transition-all"
      >
        Daftar Event
      </button>
    </div>
  );
};

export default EventSidebar;
