// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegistrationSuccessModal from '../components/RegistrationSuccessModal';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registerUser = async (userData: any) => {
    const api_url = 'https://harmoni-alam-api-819767094904.asia-southeast2.run.app/api/volunteer/register';
    const { data } = await axios.post(api_url, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    });
    return data;
  };

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      // Menampilkan pesan error dari API jika ada
      const errorMessage = error.response?.data?.message || "Registrasi gagal. Email mungkin sudah terdaftar.";
      setFormError(errorMessage);
      console.error('Registration failed:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); // Reset error setiap kali submit
    if (formData.password !== formData.confirmPassword) {
      setFormError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 mt-16">
          <div className="text-center mb-8">
            <img src="/Logo_HarmoniAlam.png" alt="Logo" className="mx-auto h-24 w-24" />
            <h1 className="text-4xl font-bold mt-4 text-[#1A3A53]">Harmoni<span className="text-[#79B829]">Alam</span></h1>
            <p className="text-gray-600">Join the environmental Movement</p>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="text-left"><h2 className="text-3xl font-bold text-[#1A3A53]">Create Account</h2><p className="text-gray-500 mt-1">Join HarmoniAlam and start making a difference</p></div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label>First Name</label><input name="firstName" type="text" required onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 border rounded-lg"/></div>
                <div><label>Last Name</label><input name="lastName" type="text" required onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 border rounded-lg"/></div>
              </div>
              <div><label>Email</label><input name="email" type="email" required onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 border rounded-lg"/></div>
              <div><label>Password</label><input name="password" type="password" required onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 border rounded-lg"/></div>
              <div><label>Confirm Password</label><input name="confirmPassword" type="password" required onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 border rounded-lg"/></div>
              <div className="text-right text-sm"><Link to="/login" className="font-semibold text-gray-500 hover:underline">Already have an account?</Link></div>
              
              {formError && <p className="text-red-500 text-center text-sm">{formError}</p>}
              
              <div>
                <button type="submit" disabled={mutation.isPending} className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-bold text-white bg-[#1A3A53] hover:bg-opacity-90 disabled:bg-slate-400">
                  {mutation.isPending ? 'Mendaftarkan...' : 'Sign Up'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
      <RegistrationSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        email={formData.email}
      />
    </>
  );
};

export default RegisterPage;