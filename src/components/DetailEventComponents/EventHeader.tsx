import React from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import volunteerApi from "../../API/volunteer";

const formatTime = (isoString: string) =>
  new Date(isoString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const addBookmark = (eventId: number) => volunteerApi.post(`/bookmarks/events/${eventId}`);
const removeBookmark = (eventId: number) => volunteerApi.delete(`/bookmarks/events/${eventId}`);
const fetchBookmarks = async () => {
  const { data } = await volunteerApi.get('/bookmarks');
  return data.filter((item: any) => item.eventId !== null).map((item: any) => item.eventId);
};

const EventHeader: React.FC<{ event: any }> = ({ event }) => {
  const { user, requireLogin } = useAuth();
  const queryClient = useQueryClient();

  // Bookmark logic
  const { data: bookmarkedEventIds, refetch: refetchBookmark } = useQuery({
    queryKey: ['bookmarkedEvents'],
    queryFn: fetchBookmarks,
    enabled: !!user,
  });

  const isBookmarked = Array.isArray(bookmarkedEventIds) && bookmarkedEventIds.includes(event?.event_id);

  const bookmarkMutation = useMutation({
    mutationFn: () => isBookmarked ? removeBookmark(event.event_id) : addBookmark(event.event_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedEvents'] });
      refetchBookmark();
    },
  });

  if (!event) return null;
  return (
    <div>
      <div className="relative mb-6">
        <img
          src={event.imagePath}
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
        {/* Bookmark icon di pojok kiri atas gambar */}
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            className={`rounded-full p-2 shadow transition ${
              isBookmarked
                ? 'bg-[#79B829]'
                : 'bg-white/80 hover:bg-[#79B829]/80'
            }`}
            aria-label="Bookmark Event"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!user) {
                requireLogin();
                return;
              }
              bookmarkMutation.mutate();
            }}
            disabled={bookmarkMutation.isPending}
          >
            {/* SVG Bookmark */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isBookmarked ? 'text-white' : 'text-[#79B829]'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
            </svg>
          </button>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 text-[#1A3A53] px-4 py-2 rounded-lg text-sm font-normal shadow-md">
          {event.currentParticipants}/{event.maxParticipants} Peserta
        </div>
      </div>
      <h1 className="text-4xl font-normal text-[#1A3A53] mb-4">
        {event.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 font-light">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>{new Date(event.eventDate).toLocaleDateString("id-ID")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>{formatTime(event.eventTime)} WIB</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
        {/* Tambahan: Menampilkan nama organizer */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-5 w-5 text-gray-500" />
          <span className="font-light">{event.organizerName}</span>
        </div>
      </div>
    </div>
  );
};
export default EventHeader;
