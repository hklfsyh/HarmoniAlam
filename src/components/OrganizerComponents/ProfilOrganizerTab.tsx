// src/components/OrganizerComponents/ProfilOrganizerTab.tsx
import React from 'react';
import { Link } from 'lucide-react';

interface ProfilOrganizerTabProps {
  onEditClick: () => void;
}

const ProfilOrganizerTab: React.FC<ProfilOrganizerTabProps> = ({ onEditClick }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Profil Organizer</h2>
      
      {/* Top Section with Profile Picture */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="flex-shrink-0">
          <img 
            // Ganti dengan URL gambar profil dari data
            src="https://via.placeholder.com/150" 
            alt="Profil Organizer" 
            className="h-36 w-36 rounded-lg object-cover shadow-md"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-grow">
          <div>
            <h3 className="font-semibold text-lg mb-2">Informasi Dasar</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Nama Organizer:</strong> Budi Susanto</p>
              <p><strong>Organisasi:</strong> EcoJakarta Community</p>
              <p><strong>Email:</strong> admin@ecojakarta.org</p>
              <p><strong>Telepon:</strong> +62 812-3456-7890</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Statistik</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Bergabung Sejak:</strong> 20 Juli 2024</p>
              <p><strong>Total Event Dibuat:</strong> 12 event</p>
              <p><strong>Total Partisipan:</strong> 847 Orang</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6"/>

      {/* Bottom Section */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Deskripsi Organisasi</h3>
        <p className="text-sm text-gray-600">
          Komunitas peduli lingkungan yang berfokus pada kegiatan pembersihan dan edukasi lingkungan di Jakarta
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div>
                <h3 className="font-semibold text-lg mb-2">Website</h3>
                <a href="https://www.ecojakarta.org" className="text-sm text-blue-600 break-all">https://www.ecojakarta.org</a>
            </div>
             <div>
                <h3 className="font-semibold text-lg mb-2">Dokumen Legalitas</h3>
                <a href="#" className="text-sm text-blue-600 flex items-center gap-2">
                    <Link size={16} />
                    Lihat Dokumen Terlampir
                </a>
            </div>
        </div>
      </div>

      <div className="text-left mt-8">
        <button 
          onClick={onEditClick} 
          className="border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};
export default ProfilOrganizerTab;