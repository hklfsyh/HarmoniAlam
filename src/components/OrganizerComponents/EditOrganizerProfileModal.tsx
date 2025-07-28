import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { UploadCloud } from 'lucide-react';

// Tipe data profil organizer
interface OrganizerProfile {
  orgName: string;
  responsiblePerson: string;
  phoneNumber: string;
  website: string;
  orgAddress: string;
  orgDescription: string;
  profilePicture?: string;
  status?: string;
}

// Fungsi API
const fetchMyProfile = async (): Promise<OrganizerProfile> => {
    const { data } = await organizerApi.get<OrganizerProfile>('/organizer/profile');
    return data;
};
const updateMyProfile = async (formData: FormData) => {
    const { data } = await organizerApi.patch('/organizer/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

// Props
interface EditOrganizerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const EditOrganizerProfileModal: React.FC<EditOrganizerProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
      orgName: '', responsiblePerson: '',  phoneNumber: '',
      website: '', orgAddress: '', orgDescription: ''
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery<OrganizerProfile>({
    queryKey: ['organizerProfile'],
    queryFn: fetchMyProfile,
    enabled: isOpen,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        orgName: profile.orgName || '',
        responsiblePerson: profile.responsiblePerson || '',
        phoneNumber: profile.phoneNumber || '',
        website: profile.website || '',
        orgAddress: profile.orgAddress || '',
        orgDescription: profile.orgDescription || '',
      });
      setImagePreview(profile.profilePicture || null);
    }
  }, [profile]);

  const mutation = useMutation({
      mutationFn: updateMyProfile,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['organizerProfile'] });
          const successMessage = profile?.status === 'approved' 
              ? "Profil Anda berhasil diperbarui."
              : "Pengajuan Anda telah berhasil dikirim ulang dan akan ditinjau oleh admin.";
          onSuccess(successMessage);
      },
      onError: (error: any) => { alert(`Gagal memperbarui profil: ${error.message}`); }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'document') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (fileType === 'image') {
              setProfilePictureFile(file);
              setImagePreview(URL.createObjectURL(file));
          } else {
              setDocumentFile(file);
          }
      }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        // Hanya kirim field yang diisi atau diubah
        if (value && profile && key in profile && (profile as any)[key] !== value) {
            submissionData.append(key, value);
        } else if (value && profile && !(key in profile)) {
            submissionData.append(key, value);
        }
    });

    if (profilePictureFile) submissionData.append('image', profilePictureFile);
    if (documentFile) submissionData.append('document', documentFile);
    
    mutation.mutate(submissionData);
  };

  if (!isOpen) return null;

  const getButtonText = () => {
      if (mutation.isPending) return 'Menyimpan...';
      if (profile?.status === 'approved') return 'Simpan Perubahan';
      return 'Ajukan Ulang';
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Edit Profil Organizer</h2>
        {isLoading ? <p>Memuat profil...</p> : (
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-semibold">Nama Organisasi</label><input name="orgName" value={formData.orgName} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"/></div>
                    <div><label className="block text-sm font-semibold">Penanggung Jawab</label><input name="responsiblePerson" value={formData.responsiblePerson} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-semibold">Nomor Telepon</label><input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"/></div>
                    <div><label className="block text-sm font-semibold">Website</label><input name="website" value={formData.website} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"/></div>
                </div>
                <div><label className="block text-sm font-semibold">Alamat Organisasi</label><textarea name="orgAddress" value={formData.orgAddress} onChange={handleChange} rows={3} className="w-full mt-1 px-4 py-2 border rounded-lg"/></div>
                <div><label className="block text-sm font-semibold">Deskripsi Organisasi</label><textarea name="orgDescription" value={formData.orgDescription} onChange={handleChange} rows={5} className="w-full mt-1 px-4 py-2 border rounded-lg"/></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-semibold">Ganti Foto Profil (Opsional)</label>
                        <div className="mt-1 flex items-center gap-4">
                            {imagePreview && <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />}
                            <label htmlFor="profilePicture-upload" className="flex-grow cursor-pointer ...">
                                <UploadCloud size={24} className="mb-1"/>
                                <span>{profilePictureFile ? profilePictureFile.name : 'Pilih file'}</span>
                                <input id="profilePicture-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
                            </label>
                        </div>
                    </div>
                     <div><label className="block text-sm font-semibold">Ganti Dokumen (Opsional)</label>
                        <label htmlFor="document-upload" className="mt-1 flex-grow cursor-pointer ...">
                            <UploadCloud size={24} className="mb-1"/>
                            <span>{documentFile ? documentFile.name : 'Pilih file'}</span>
                            <input id="document-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'document')} />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">Batal</button>
                  <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400">
                      {getButtonText()}
                  </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};
export default EditOrganizerProfileModal;
