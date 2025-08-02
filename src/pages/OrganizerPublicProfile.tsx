import React from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import publicApi from "../API/publicApi";

type Event = {
  event_id: number;
  title: string;
  eventDate: string;
  imagePath: string;
  location: string;
  currentParticipants: number;
  maxParticipants: number;
};

type OrganizerPublicProfile = {
  orgName: string;
  orgDescription: string;
  profilePicture: string;
  website: string;
  events: Event[];
};

const fetchOrganizerPublicProfile = async (id: string): Promise<OrganizerPublicProfile> => {
  const { data } = await publicApi.get<OrganizerPublicProfile>(`/organizer/${id}/public`);
  return data;
};

const OrganizerPublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profile, isLoading, isError } = useQuery<OrganizerPublicProfile>({
    queryKey: ["organizerPublicProfile", id],
    queryFn: () => fetchOrganizerPublicProfile(id!),
    enabled: !!id,
  });

  const prevPath = location.state?.from || "/event";

  if (isLoading) {
    return <div className="p-8 text-center">Memuat profil organizer...</div>;
  }

  if (isError || !profile) {
    return <div className="p-8 text-center text-red-500">Gagal memuat profil organizer.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4" style={{ paddingTop: 100 }}>
      <button
        onClick={() => navigate(prevPath)}
        className="flex items-center gap-2 mb-8 text-[#1A3A53] hover:text-[#79B829] font-semibold transition-colors"
      >
        <ArrowLeft size={22} />
        <span>Kembali ke halaman sebelumnya</span>
      </button>

      <div className="bg-gradient-to-r from-[#eaf6e9] via-[#f6fafd] to-[#eaf6e9] rounded-2xl shadow-xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8 border border-[#e0e0e0]">
        <img
          src={profile.profilePicture}
          alt={profile.orgName}
          className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-[#79B829] bg-white"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-[#1A3A53] mb-2">{profile.orgName}</h1>
          <p className="text-gray-700 mb-4 text-lg">{profile.orgDescription}</p>
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#79B829] hover:underline font-semibold text-lg"
            >
              <ExternalLink size={20} /> {profile.website}
            </a>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#1A3A53] mb-6 text-center md:text-left">Event oleh {profile.orgName}</h2>
      {profile.events.length === 0 ? (
        <div className="text-gray-500 py-12 text-center bg-white rounded-xl shadow border">Belum ada event yang dibuat oleh organizer ini.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.events.map((event) => (
            <Link
              to={`/event/detail/${event.event_id}`}
              key={event.event_id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e0e0e0] flex flex-col hover:scale-[1.03] hover:shadow-xl transition-all"
            >
              <div className="relative">
                <img
                  src={event.imagePath}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:brightness-90 transition"
                />
                <span className="absolute top-3 left-3 bg-[#79B829] text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
                  {event.currentParticipants}/{event.maxParticipants} Partisipan
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="text-xl font-bold text-[#1A3A53] mb-2 group-hover:text-[#79B829] transition">{event.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Calendar size={16} />
                  {new Date(event.eventDate).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <MapPin size={16} />
                  {event.location}
                </div>
                <button
                  className="mt-3 px-4 py-2 rounded-lg bg-[#1A3A53] text-white font-semibold hover:bg-[#79B829] transition-colors"
                  type="button"
                >
                  Lihat Detail Event
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerPublicProfilePage;