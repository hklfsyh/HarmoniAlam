// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import IdleTimer from '../utils/idleTimer';

interface User {
  id: number;
  role: 'volunteer' | 'organizer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  requireLogin: () => void;
  closeLoginModal: () => void;
  isLoading: boolean; // Tambahkan ini
  resetIdleTimer: () => void; // Tambahkan fungsi reset timer
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan ini
  const idleTimerRef = useRef<IdleTimer | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Stored token on reload:', storedToken); // Debug log
    
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        console.log('Decoded token:', decoded); // Debug log
        console.log('Token expiry:', new Date(decoded.exp * 1000)); // Debug log
        console.log('Current time:', new Date()); // Debug log
        
        // Cek apakah token sudah kedaluwarsa
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired, removing...'); // Debug log
          localStorage.removeItem('token');
        } else {
          const userRole = decoded.isAdmin ? 'admin' : decoded.type;
          const user = { id: decoded.adminId || decoded.organizerId || decoded.volunteerId, role: userRole };
          console.log('Setting user:', user); // Debug log
          setUser(user);
          setToken(storedToken);
          
          // Start idle timer untuk user yang sudah login
          startIdleTimer();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    } else {
      console.log('No token found in localStorage'); // Debug log
    }
    setIsLoading(false); // Set loading selesai
  }, []);

  // Fungsi untuk memulai idle timer
  const startIdleTimer = () => {
    if (idleTimerRef.current) {
      idleTimerRef.current.stop();
    }

    const handleIdleTimeout = () => {
      // Clear session
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      
      // Tampilkan notifikasi
      alert('Sesi Anda telah berakhir karena tidak ada aktivitas selama 1 jam. Silakan login kembali.');
      
      // Redirect ke halaman login
      window.location.href = '/login';
    };

    idleTimerRef.current = new IdleTimer(3600000, handleIdleTimeout); // 1 jam = 3600000ms
    idleTimerRef.current.start();
  };

  // Fungsi untuk reset idle timer
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      idleTimerRef.current.resetTimer();
    }
  };

  const login = (newToken: string) => {
    try {
      const decoded: any = jwtDecode(newToken);
      const userRole = decoded.isAdmin ? 'admin' : decoded.type;
      const newUser = { id: decoded.adminId || decoded.organizerId || decoded.volunteerId, role: userRole };
      
      localStorage.setItem('token', newToken);
      setUser(newUser);
      setToken(newToken);
      
      // Start idle timer setelah login berhasil
      startIdleTimer();
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    // Stop idle timer saat logout
    if (idleTimerRef.current) {
      idleTimerRef.current.stop();
      idleTimerRef.current = null;
    }
    
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const requireLogin = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Cleanup idle timer saat component unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        idleTimerRef.current.stop();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoginModalOpen, requireLogin, closeLoginModal, isLoading, resetIdleTimer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};