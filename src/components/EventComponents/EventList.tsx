import React from "react";
import { useQuery } from "@tanstack/react-query";
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

// Props diubah untuk menyertakan handler onCancelClick
interface EventListProps {
  searchTerm: string;
  selectedCategory: number | null;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
  onCancelClick: (event: Event) => void; // Prop baru ditambahkan di sini
}

const EventList: React.FC<EventListProps> = ({
  searchTerm,
  selectedCategory,
  onSuccess,
  onFailure,
  onCancelClick,
}) => {
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery<Event[], Error>({
    queryKey: ["publicEvents", searchTerm, selectedCategory],
    queryFn: () => fetchEvents(searchTerm, selectedCategory),
  });

  return (
    <div className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-normal text-center text-[#1A3A53] mb-10">
        Daftar Event Mendatang
      </h2>

      {isLoading && <p className="text-center">Mencari event...</p>}
      {isError && (
        <p className="text-center text-red-500">
          Gagal memuat event: {error.message}
        </p>
      )}

      {events &&
        (events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                onSuccess={onSuccess}
                onFailure={onFailure}
                onCancelClick={onCancelClick} // Prop diteruskan ke setiap EventCard
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-normal text-gray-700">
              Tidak Ada Event yang Ditemukan
            </h3>
            <p className="text-gray-500 mt-2 font-light">
              Coba gunakan kata kunci atau filter yang berbeda.
            </p>
          </div>
        ))}
    </div>
  );
};

export default EventList;
