import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import publicApi from '../API/publicApi';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

// Fungsi API untuk mereset password
const resetPassword = async ({ token, newPassword }: { token: string, newPassword: string }) => {
    const { data } = await publicApi.post('/auth/reset-password', { token, newPassword });
    return data;
};

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Ambil token dari URL saat komponen dimuat
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // Jika tidak ada token, tampilkan error atau redirect
      setModalMessage("Token reset password tidak valid atau tidak ditemukan.");
      setIsErrorModalOpen(true);
    }
  }, [searchParams]);

  const mutation = useMutation({
      mutationFn: resetPassword,
      onSuccess: () => {
          setModalMessage("Password Anda telah berhasil direset. Silakan login dengan password baru Anda.");
          setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
          setModalMessage(error.response?.data?.message || "Gagal mereset password.");
          setIsErrorModalOpen(true);
      }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (!token) {
      alert("Token tidak valid.");
      return;
    }
    mutation.mutate({ token, newPassword: password });
  };
  
  const handleSuccessModalClose = () => {
      setIsSuccessModalOpen(false);
      navigate('/login'); // Arahkan ke halaman login setelah sukses
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-grow flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center mb-8">
              <img src="/Logo_HarmoniAlam.png" alt="Logo" className="mx-auto h-24 w-24" />
              <h1 className="text-4xl font-bold mt-4 text-[#1A3A53]">Harmoni<span className="text-[#79B829]">Alam</span></h1>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
              <div className="text-left"><h2 className="text-3xl font-bold text-[#1A3A53]">Reset Password</h2><p className="text-gray-500 mt-1">Masukkan password baru Anda di bawah ini.</p></div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-3 border rounded-lg pr-12"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-3 border rounded-lg pr-12"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                      <button type="submit" disabled={mutation.isPending || !token} className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-bold text-white bg-[#1A3A53] hover:bg-opacity-90 disabled:bg-slate-400">
                          {mutation.isPending ? 'Menyimpan...' : 'Reset Password'}
                      </button>
                  </div>
              </form>
          </div>
        </main>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Reset Berhasil!"
        message={modalMessage}
        buttonText="Lanjutkan ke Login"
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

export default ResetPasswordPage;
