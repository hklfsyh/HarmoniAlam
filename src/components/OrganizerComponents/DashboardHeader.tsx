import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { Calendar, Plus, Mail } from 'lucide-react';


// Tipe data untuk profil organizer
interface OrganizerProfile {
  approvedAt?: string;
  createdAt?: string; // Menambahkan createdAt untuk fallback
  status: string;
}

// Fungsi untuk mengambil data profil organizer
const fetchOrganizerProfile = async (): Promise<OrganizerProfile> => {
  const { data } = await organizerApi.get<OrganizerProfile>('/organizer/profile');
  return data;
};

interface DashboardHeaderProps {
  onPermissionDenied: (message: string) => void;
  onContactAdminClick: () => void; // Prop baru untuk modal
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onPermissionDenied, onContactAdminClick }) => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useQuery<OrganizerProfile>({
    queryKey: ['organizerProfile'],
    queryFn: fetchOrganizerProfile,
  });

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault(); // Selalu cegah navigasi langsung

    if (isLoading) return; // Jangan lakukan apa-apa jika data masih loading

    if (profile?.status === 'approved') {
      navigate(path); // Lanjutkan navigasi jika status 'approved'
    } else if (profile?.status === 'pending') {
      onPermissionDenied("Akun Anda sedang ditinjau oleh admin. Mohon tunggu persetujuan untuk mengakses fitur ini.");
    } else if (profile?.status === 'rejected') {
      onPermissionDenied("Pengajuan Anda sebelumnya ditolak. Silakan perbarui profil Anda untuk mengajukan ulang.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A3A53]">Dashboard Organizer</h1>
        <div className="flex items-center gap-2 mt-1 text-gray-500">
          <Calendar size={16} />
          <span>
            {(() => {
              if (!profile) return 'Memuat...';
              if (profile.status === 'approved') {
                return `Bergabung Sejak ${profile.approvedAt ? new Date(profile.approvedAt).toLocaleDateString('id-ID') : '-'}`;
              }
              if (profile.status === 'pending') return 'Akun Anda sedang ditinjau';
              if (profile.status === 'rejected') return 'Akun Anda ditolak';
              return '';
            })()}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onContactAdminClick}
          className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90"
          title="Hubungi Admin"
        >
          <Mail size={18} />
          Hubungi Admin
        </button>
        <Link
          to="/dashboard/artikel/create"
          onClick={(e) => handleLinkClick(e, "/dashboard/artikel/create")}
          className="flex items-center gap-2 bg-[#79B829] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90"
        >
          <Plus size={18} /> Tulis Artikel
        </Link>
        <Link
          to="/dashboard/event/create"
          onClick={(e) => handleLinkClick(e, "/dashboard/event/create")}
          className="bg-[#1A3A53] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90"
        >
          Buat Event Baru
        </Link>
      </div>
    </div>
  );
};
export default DashboardHeader;
