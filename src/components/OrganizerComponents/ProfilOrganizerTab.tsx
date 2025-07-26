import React from 'react';
import { useQuery } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { Link as LinkIcon, Globe, Camera } from 'lucide-react';

// Fungsi untuk mengambil data profil organizer
const fetchOrganizerProfile = async () => {
    const { data } = await organizerApi.get('/organizer/profile');
    return data;
};

interface ProfilOrganizerTabProps {
  onEditClick: () => void;
}

const ProfilOrganizerTab: React.FC<ProfilOrganizerTabProps> = ({ onEditClick }) => {
    const { data: profile, isLoading, isError, error } = useQuery({
        queryKey: ['organizerProfile'],
        queryFn: fetchOrganizerProfile,
    });

    if (isLoading) {
        return <p className="p-4 text-center">Memuat profil...</p>;
    }

    if (isError) {
        return <p className="p-4 text-center text-red-500">Terjadi kesalahan: {error.message}</p>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Profil Organizer</h2>
            
            <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                    {profile.profilePicture ? (
                        <img 
                            src={profile.profilePicture} 
                            alt={profile.orgName} 
                            className="h-36 w-36 rounded-lg object-cover shadow-md"
                        />
                    ) : (
                        <div className="h-36 w-36 rounded-lg bg-slate-200 flex items-center justify-center">
                            <Camera size={48} className="text-slate-400" />
                        </div>
                    )}
                </div>
                
                {/* Info Section */}
                <div className="flex-grow">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Informasi Dasar</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Nama Organizer:</strong> {profile.responsiblePerson}</p>
                            <p><strong>Organisasi:</strong> {profile.orgName}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Telepon:</strong> {profile.phoneNumber}</p>
                            <p><strong>Bergabung Sejak:</strong> {new Date(profile.approvedAt).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-6"/>

            <div>
                <h3 className="font-semibold text-lg mb-2">Deskripsi Organisasi</h3>
                <p className="text-sm text-gray-600">{profile.orgDescription}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Website</h3>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 flex items-center gap-2 hover:underline">
                            <Globe size={16} />
                            {profile.website}
                        </a>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Dokumen Legalitas</h3>
                        <a href={profile.documentPath} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 flex items-center gap-2 hover:underline">
                            <LinkIcon size={16} />
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
