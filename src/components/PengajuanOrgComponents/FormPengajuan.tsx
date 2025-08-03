import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import publicApi from '../../API/publicApi';
import { UploadCloud } from 'lucide-react';

// Fungsi untuk mengirim data pendaftaran organizer
const registerOrganizer = async (formData: FormData) => {
    const { data } = await publicApi.post('/organizer/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

interface FormPengajuanProps {
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
}

// --- KOMPONEN HELPER DIPINDAHKAN KE LUAR ---

type FormFieldProps = {
    name: keyof FormPengajuanState; // Menggunakan tipe yang lebih aman
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
};

const FormField: React.FC<FormFieldProps> = ({ name, label, value, onChange, type = 'text', error }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
        <input 
            name={name} 
            type={type} 
            value={value}
            onChange={onChange}
            className={`w-full mt-1 px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base ${error ? 'border-red-500' : 'border-gray-300'}`} 
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

type TextAreaFieldProps = {
    name: keyof FormPengajuanState;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    rows?: number;
};

const TextAreaField: React.FC<TextAreaFieldProps> = ({ name, label, value, onChange, error, rows = 4 }) => (
     <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
        <textarea 
            name={name} 
            value={value}
            onChange={onChange} 
            rows={rows} 
            className={`w-full mt-1 px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base ${error ? 'border-red-500' : 'border-gray-300'}`} 
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

// Tipe untuk state formData
type FormPengajuanState = {
    orgName: string;
    responsiblePerson: string;
    email: string;
    password: string;
    phoneNumber: string;
    website: string;
    orgAddress: string;
    orgDescription: string;
};


const FormPengajuan: React.FC<FormPengajuanProps> = ({ onSuccess, onFailure }) => {
    const [formData, setFormData] = useState<FormPengajuanState>({
        orgName: '',
        responsiblePerson: '',
        email: '',
        password: '',
        phoneNumber: '',
        website: '',
        orgAddress: '',
        orgDescription: '',
    });
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<any>({});

    const mutation = useMutation({
        mutationFn: registerOrganizer,
        onSuccess: () => {
            onSuccess("Pengajuan berhasil! Silakan verifikasi email Anda. Jika sudah, mohon tunggu untuk di-approve agar Anda dapat menikmati fitur sebagai organizer.");
        },
        onError: (error: any) => {
            onFailure(error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        let isValid = true;
        for (const key in formData) {
            if (!formData[key as keyof FormPengajuanState].trim()) {
                newErrors[key] = "Field ini tidak boleh kosong.";
                isValid = false;
            }
        }
        if (!documentFile) {
            newErrors.document = "Anda harus mengunggah dokumen.";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submissionData.append(key, value);
        });
        if (documentFile) {
            submissionData.append('document', documentFile);
        }
        
        mutation.mutate(submissionData);
    };

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A3A53] mb-4 sm:mb-6">Form Pengajuan Organizer</h2>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <FormField name="orgName" label="Nama Organisasi" value={formData.orgName} onChange={handleChange} error={errors.orgName} />
                    <FormField name="responsiblePerson" label="Nama Penanggung Jawab" value={formData.responsiblePerson} onChange={handleChange} error={errors.responsiblePerson} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <FormField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                    <FormField name="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <FormField name="phoneNumber" label="Nomor Telepon" value={formData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} />
                    <FormField name="website" label="Website" value={formData.website} onChange={handleChange} error={errors.website} />
                </div>
                <TextAreaField name="orgAddress" label="Alamat Organisasi" value={formData.orgAddress} onChange={handleChange} error={errors.orgAddress} />
                <TextAreaField name="orgDescription" label="Deskripsi Organisasi" value={formData.orgDescription} onChange={handleChange} error={errors.orgDescription} rows={6} />
                
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Dokumen Legalitas (Contoh: KTP)</label>
                    <label htmlFor="document-upload" className={`flex-grow cursor-pointer flex flex-col items-center justify-center p-3 sm:p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50 ${errors.document ? 'border-red-500' : 'border-gray-300'}`}>
                      <UploadCloud size={20} className="mb-2"/>
                      <span className="text-xs sm:text-sm">{documentFile ? documentFile.name : 'Klik untuk memilih file'}</span>
                      <input id="document-upload" name="document" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"/>
                    </label>
                    {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}
                </div>
                
                <button type="submit" disabled={mutation.isPending} className="w-full bg-[#1A3A53] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 disabled:bg-slate-400 text-sm sm:text-base">
                    {mutation.isPending ? 'Mengirim...' : 'Kirim Pengajuan'}
                </button>
            </form>
        </div>
    );
};

export default FormPengajuan;
