import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {  Calendar,  Camera } from 'lucide-react';
import volunteerApi from '../../API/volunteer';

// Fungsi untuk mengambil data profil dari API
const fetchVolunteerProfile = async () => {
    const { data } = await volunteerApi.get('/volunteer/profile');
    return data;
};

interface ProfileSidebarProps {
  onEditClick: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onEditClick }) => {
    const { data: profile, isLoading, isError, error } = useQuery({
        queryKey: ['volunteerProfile'],
        queryFn: fetchVolunteerProfile,
    });

    if (isLoading) {
        return (
            <aside className="bg-white p-6 rounded-lg shadow-md text-center animate-pulse">
                <div className="mx-auto h-32 w-32 rounded-full bg-slate-200 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
            </aside>
        );
    }

    if (isError) {
        return <aside className="bg-white p-6 rounded-lg shadow-md text-center text-red-500">Gagal memuat profil.</aside>;
    }

    return (
        <aside className="bg-white p-6 rounded-lg shadow-md text-center">
            {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="mx-auto h-32 w-32 rounded-full object-cover mb-4" />
            ) : (
                <div className="mx-auto h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                    <Camera size={48} className="text-slate-400" />
                </div>
            )}
            <h2 className="text-2xl font-bold text-[#1A3A53]">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-600 break-words max-w-full">{profile.email}</p>
            <div className="text-left mt-6 space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span>Bergabung {new Date(profile.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>
            <button 
                onClick={onEditClick}
                className="mt-6 w-full py-2 border border-[#79B829] text-[#79B829] font-semibold rounded-lg hover:bg-[#79B829] hover:text-white transition-colors"
            >
                Edit Profile
            </button>
        </aside>
    );
};

export default ProfileSidebar;
