// src/components/ProfileComponents/ProfileSidebar.tsx
import React from 'react';
import { User, Calendar, MapPin } from 'lucide-react';

interface ProfileSidebarProps {
  onEditClick: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onEditClick }) => {
  return (
    <aside className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="mx-auto h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center mb-4">
        <User className="h-20 w-20 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A3A53]">Gheryl Ivan</h2>
      <p className="text-gray-600">gheryl@example.com</p>
      <div className="text-left mt-6 space-y-3 text-sm text-gray-500">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5" />
          <span>Bergabung 15 Januari 2024</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5" />
          <span>Jakarta, Indonesia</span>
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