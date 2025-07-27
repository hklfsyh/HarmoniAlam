import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

// Fungsi login yang mencoba setiap peran
const loginUser = async (credentials: {email: string, password: string}) => {
    const api_url = 'http://localhost:3000/api';
    const rolesToTry = ['volunteer', 'organizer', 'admin'];

    for (const role of rolesToTry) {
      try {
        const { data } = await axios.post(`${api_url}/${role}/login`, {
            email: credentials.email,
            password: credentials.password,
        });
        return { token: data.token, role: role };
      } catch (error) {
        console.log(`Login as ${role} failed, trying next...`);
      }
    }
    throw new Error('Invalid credentials for all roles');
};

// Fungsi untuk meminta reset password
const forgotPasswordRequest = async (email: string) => {
    const api_url = 'http://localhost:3000/api';
    const { data } = await axios.post(`${api_url}/auth/forgot-password`, { email });
    return data;
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token);
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'organizer') navigate('/organizer');
      else navigate('/profile');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const forgotPasswordMutation = useMutation({
      mutationFn: forgotPasswordRequest,
      onSuccess: () => {
          setIsForgotModalOpen(false);
          setModalMessage("Link untuk mereset password telah dikirim ke email Anda. Silakan periksa inbox Anda.");
          setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
          setIsForgotModalOpen(false);
          setModalMessage(error.response?.data?.message || "Gagal mengirim link reset.");
          setIsErrorModalOpen(true);
      }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleConfirmForgotPassword = (email: string) => {
      forgotPasswordMutation.mutate(email);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-grow flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center mb-8">
              <img src="/Logo_HarmoniAlam.png" alt="Logo" className="mx-auto h-24 w-24" />
              <h1 className="text-4xl font-bold mt-4 text-[#1A3A53]">Harmoni<span className="text-[#79B829]">Alam</span></h1>
              <p className="text-gray-600">Join the environmental Movement</p>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
              <div className="text-left"><h2 className="text-3xl font-bold text-[#1A3A53]">Welcome</h2><p className="text-gray-500 mt-1">Sign in to your HarmoniAlam account</p></div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"/></div>
                  <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"/></div>
                  <div className="flex items-center justify-between text-sm">
                      <Link to="/register" className="font-semibold text-[#79B829] hover:underline">Register</Link>
                      <button type="button" onClick={() => setIsForgotModalOpen(true)} className="font-medium text-gray-500 hover:underline">
                          Forgot Password?
                      </button>
                  </div>
                  <div>
                      <button type="submit" disabled={loginMutation.isPending} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#1A3A53] hover:bg-opacity-90 disabled:bg-slate-400">
                          {loginMutation.isPending ? 'Mencoba Login...' : 'Sign In'}
                      </button>
                  </div>
                  {loginMutation.isError && <p className="text-red-500 text-center text-sm">Login Gagal. Email atau password tidak ditemukan.</p>}
              </form>
          </div>
        </main>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onConfirm={handleConfirmForgotPassword}
        isSending={forgotPasswordMutation.isPending}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Link Terkirim!"
        message={modalMessage}
        buttonText="Selesai"
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Gagal"
        message={modalMessage}
        buttonText="Coba Lagi"
      />
    </>
  );
};

export default LoginPage;
