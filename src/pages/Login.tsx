// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Fungsi login baru yang mencoba setiap peran secara berurutan
  const loginUser = async (credentials: {email: string, password: string}) => {
    const api_url = 'https://harmoni-alam-api-819767094904.asia-southeast2.run.app/api';
    const rolesToTry = ['volunteer', 'organizer', 'admin'];

    for (const role of rolesToTry) {
      try {
        const { data } = await axios.post(`${api_url}/${role}/login`, {
            email: credentials.email,
            password: credentials.password,
        });
        // Jika berhasil, kembalikan token dan peran yang berhasil
        return { token: data.token, role: role };
      } catch (error) {
        // Jika gagal (misalnya error 401), abaikan dan coba peran berikutnya
        console.log(`Login as ${role} failed, trying next...`);
      }
    }

    // Jika semua peran gagal, lempar error
    throw new Error('Invalid credentials for all roles');
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 'data' sekarang berisi { token, role }
      login(data.token);
      
      // Arahkan ke halaman yang sesuai berdasarkan peran yang berhasil
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'organizer') navigate('/organizer');
      else navigate('/profile');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 mt-16">
        <div className="text-center mb-8">
            <img src="/Logo_HarmoniAlam.png" alt="Logo" className="mx-auto h-24 w-24" />
            <h1 className="text-4xl font-bold mt-4 text-[#1A3A53]">Harmoni<span className="text-[#79B829]">Alam</span></h1>
            <p className="text-gray-600">Join the environmental Movement</p>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
            <div className="text-left"><h2 className="text-3xl font-bold text-[#1A3A53]">Welcome</h2><p className="text-gray-500 mt-1">Sign in to your HarmoniAlam account</p></div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                
                {/* Pilihan peran dihapus dari sini */}
                
                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"/></div>
                <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"/></div>
                <div className="flex items-center justify-between text-sm"><Link to="/register" className="font-semibold text-[#79B829] hover:underline">Register</Link><a href="#" className="font-medium text-gray-500 hover:underline">Forgot Password?</a></div>
                <div>
                    <button type="submit" disabled={mutation.isPending} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#1A3A53] hover:bg-opacity-90 disabled:bg-slate-400">
                        {mutation.isPending ? 'Mencoba Login...' : 'Sign In'}
                    </button>
                </div>
                {mutation.isError && <p className="text-red-500 text-center text-sm">Login Gagal. Email atau password tidak ditemukan.</p>}
            </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;