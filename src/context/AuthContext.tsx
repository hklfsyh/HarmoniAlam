// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        // Cek apakah token sudah kedaluwarsa
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          const userRole = decoded.isAdmin ? 'admin' : decoded.type;
          setUser({ id: decoded.adminId || decoded.organizerId || decoded.volunteerId, role: userRole });
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    const decoded: any = jwtDecode(newToken);
    const userRole = decoded.isAdmin ? 'admin' : decoded.type;
    setUser({ id: decoded.adminId || decoded.organizerId || decoded.volunteerId, role: userRole });
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const requireLogin = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoginModalOpen, requireLogin, closeLoginModal }}>
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