import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';
import { Camera, UploadCloud } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: (message: string) => void;
}

// Fungsi untuk mengirim update (PATCH)
const updateUserProfile = async (formData: FormData) => {
  const { data } = await volunteerApi.patch('/volunteer/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Fungsi untuk mengambil data profil yang ada
const fetchVolunteerProfile = async () => {
  const { data } = await volunteerApi.get('/volunteer/profile');
  return data;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSuccess, onFailure }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({ firstName: '', lastName: '' });

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['volunteerProfile'],
    queryFn: fetchVolunteerProfile,
    enabled: isOpen,
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      });
      setImagePreview(profileData.profilePicture);
      setErrors({ firstName: '', lastName: '' });
    }
  }, [profileData]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['volunteerProfileNav'] }); // Tambahkan untuk navbar
      onSuccess();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan pada server.";
      onFailure(errorMessage);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = { firstName: '', lastName: '' };
    let isValid = true;
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nama depan tidak boleh kosong.';
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nama belakang tidak boleh kosong.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const submissionData = new FormData();
    submissionData.append('firstName', formData.firstName);
    submissionData.append('lastName', formData.lastName);
    if (imageFile) {
      submissionData.append('image', imageFile); 
    }
    mutation.mutate(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Edit Profil</h2>
        {isLoading ? <p>Memuat data...</p> : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="text-center">
              <div className="relative inline-block">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-full object-cover" />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center"><Camera size={48} className="text-slate-400" /></div>
                )}
                <label htmlFor="profile-picture-upload" className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-slate-100">
                  <UploadCloud size={20} className="text-[#1A3A53]" />
                  <input id="profile-picture-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Nama Depan</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full mt-1 px-4 py-2 border rounded-lg ${errors.firstName ? 'border-red-500' : ''}`} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold">Nama Belakang</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full mt-1 px-4 py-2 border rounded-lg ${errors.lastName ? 'border-red-500' : ''}`} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input type="email" value={profileData?.email || ''} disabled className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">Batal</button>
              <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-[#79B829] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400">
                {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default EditProfileModal;
