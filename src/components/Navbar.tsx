import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import volunteerApi from '../API/volunteer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, LogOut, Mail, User } from 'lucide-react';
import ContactAdminModal from './ContactAdminModal';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmationModal from './ConfirmationModal';

interface VolunteerProfile {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
}

const fetchVolunteerProfile = async (): Promise<VolunteerProfile> => {
  const { data } = await volunteerApi.get('/volunteer/profile');
  return data as VolunteerProfile;
};

const contactAdmin = async ({ subject, message }: { subject: string, message: string }) => {
  const { data } = await volunteerApi.post('/contact', { subject, message });
  return data;
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['volunteerProfileNav'],
    queryFn: fetchVolunteerProfile,
    enabled: !!user && user.role === 'volunteer',
  });

  const contactMutation = useMutation({
    mutationFn: contactAdmin,
    onSuccess: () => {
      setIsContactModalOpen(false);
      setModalMessage("Pesan Anda telah berhasil dikirim ke admin.");
      setIsSuccessModalOpen(true);
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "response" in error) {
        // @ts-expect-error: dynamic error shape
        setModalMessage(error.response?.data?.message || "Gagal mengirim pesan.");
      } else {
        setModalMessage("Gagal mengirim pesan.");
      }
      setIsErrorModalOpen(true);
    }
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    queryClient.clear(); // Hapus semua cache saat logout
    navigate('/');
  };

  const handleConfirmContact = (subject: string, message: string) => {
    contactMutation.mutate({ subject, message });
  };

  const renderNavLinks = () => {
    if (user?.role === 'volunteer') {
      return (
        <>
          <Link to="/" className="text-[#1A3A53] hover:text-[#79B829] font-normal">Home</Link>
          <Link to="/event" className="text-[#1A3A53] hover:text-[#79B829] font-normal">Event</Link>
          <Link to="/artikel" className="text-[#1A3A53] hover:text-[#79B829] font-normal">Artikel</Link>
        </>
      );
    }
    // Untuk guest (user === null)
    return (
      <>
        <Link to="/" className="text-[#1A3A53] hover:text-[#79B829] font-normal">Home</Link>
        <Link to="/event" className="text-[#1A3A53] hover:text-[#79B829] font-normal">Event</Link>
        <Link to="/artikel" className="text-[#1A3A53] hover:text-[#79B829] font-normal">Artikel</Link>
      </>
    );
  };

  const renderActionButtons = () => {
    if (user?.role === 'volunteer') {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-2 py-1 rounded-full border-2 border-[#79B829] hover:shadow-lg transition-all focus:outline-none bg-white"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {profile?.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" className="h-10 w-10 rounded-full object-cover border-2 border-[#79B829]" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-[#79B829]">
                <User className="text-slate-400" size={24} />
              </div>
            )}
            <span className="font-semibold text-sm hidden md:block">{profile?.firstName}</span>
            <ChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={20} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-fadeIn">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="h-12 w-12 rounded-full object-cover border-2 border-[#79B829]" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-[#79B829]">
                    <User className="text-slate-400" size={28} />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-[#1A3A53] text-lg">{profile?.firstName} {profile?.lastName}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1"><Mail size={14} /> {profile?.email}</div>
                </div>
              </div>
              <div className="py-2 px-2">
                <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-[#1A3A53] transition-colors text-sm font-medium w-full">
                  <User size={18} /> Profile Saya
                </Link>
                <Link
                  to="/bookmark"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-[#1A3A53] transition-colors text-sm font-medium w-full"
                >
                  {/* Icon Bookmark */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#79B829]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                  </svg>
                  Bookmark
                </Link>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-[#1A3A53] transition-colors text-sm font-medium w-full"
                >
                  <Mail size={18} />
                  Kontak Admin
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 text-red-600 transition-colors text-sm font-normal w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    if (user?.role === 'admin' || user?.role === 'organizer') {
      return (
        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 font-normal"
        >
          Logout
        </button>
      );
    }
    return (
      <div className="flex items-center space-x-4">
        <Link to="/login" className="px-4 py-2 text-center text-[#1A3A53] border border-[#1A3A53] rounded-md hover:bg-slate-100 font-normal transition-colors">
          Login
        </Link>
        <Link to="/register" className="px-4 py-2 text-center text-white bg-[#1A3A53] rounded-md hover:bg-[#79B829] font-normal transition-colors">
          Register
        </Link>
      </div>
    );
  };

  let logoLink = '/';
  if (user?.role === 'admin') logoLink = '/admin/dashboard';
  else if (user?.role === 'organizer') logoLink = '/dashboard';

  return (
    <>
      <nav className={`w-full fixed top-0 left-0 z-50 shadow-md transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center h-16"> {/* Menggunakan tinggi standar h-16 */}
          
          {/* BAGIAN KIRI: Logo */}
          <div className="flex-shrink-0"> {/* Mencegah logo menyusut */}
            <Link to={logoLink}>
              <img
                src="/Logo_HarmoniAlam.png"
                alt="Logo"
                className="h-14 w-auto" // Tinggi spesifik, lebar otomatis. Ini memperbaiki logo gepeng.
              />
            </Link>
          </div>

          {/* BAGIAN TENGAH: Nav Links (hanya di layar besar) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-8">
            {/* Tampilkan nav links HANYA jika bukan admin/organizer */}
            {user?.role !== 'admin' && user?.role !== 'organizer' && renderNavLinks()}
          </div>

          {/* BAGIAN KANAN: Action Buttons */}
          <div className="flex items-center space-x-4">
            {renderActionButtons()}
          </div>

        </div>
      </nav>

      {/* Bagian Modal (tidak berubah) */}
      <ContactAdminModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onConfirm={handleConfirmContact}
        isSending={contactMutation.isPending}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Pesan Terkirim!"
        message={modalMessage}
        buttonText="Selesai"
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Gagal Mengirim"
        message={modalMessage}
        buttonText="Coba Lagi"
      />
      <ConfirmationModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          handleLogout();
        }}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin logout dari akun ini?"
        confirmText="Logout"
        cancelText="Batal"
        isConfirming={false}
      />
    </>
  );
};

export default Navbar;
