import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { UploadCloud } from 'lucide-react';

// Tipe Data
type Category = {
  category_id: number;
  categoryName: string;
};

// Fungsi API
const fetchEventDetail = async (id: number) => {
  const { data } = await organizerApi.get(`/events/${id}`);
  return data;
};
const fetchEventCategories = async (): Promise<Category[]> => {
  const { data } = await organizerApi.get('/categories/events');
  return data;
};
const updateEvent = async ({ id, formData }: { id: number, formData: FormData }) => {
  const { data } = await organizerApi.patch(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Props Komponen
interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number | null;
  onSuccess: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, eventId, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    maxParticipants: '',
    eventDate: '',
    eventTime: '',
    location: '',
    description: '',
    requiredItems: '',
    providedItems: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: eventData, isLoading } = useQuery({
    queryKey: ['organizerEventDetail', eventId],
    queryFn: () => fetchEventDetail(eventId!),
    enabled: !!eventId && isOpen,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['eventCategories'],
    queryFn: fetchEventCategories,
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData.title || '',
        category_id: String(eventData.category?.category_id || ''),
        maxParticipants: eventData.maxParticipants || '',
        eventDate: eventData.eventDate ? new Date(eventData.eventDate).toISOString().split('T')[0] : '',
        eventTime: eventData.eventTime ? new Date(eventData.eventTime).toISOString().split('T')[1].substring(0, 5) : '',
        location: eventData.location || '',
        description: eventData.description || '',
        requiredItems: eventData.requiredItems || '',
        providedItems: eventData.providedItems || '',
      });
      setImagePreview(eventData.imagePath);
    }
  }, [eventData]);

  const mutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      queryClient.invalidateQueries({ queryKey: ['organizerEventDetail', eventId] });
      onSuccess();
    },
    onError: (error: any) => { alert(`Gagal memperbarui event: ${error.message}`); }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    if (imageFile) {
      submissionData.append('image', imageFile);
    }
    mutation.mutate({ id: eventId!, formData: submissionData });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Edit Event</h2>
        {isLoading ? <p>Memuat data event...</p> : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div><label className="block text-sm font-semibold">Judul Event</label><input name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-semibold">Kategori</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-white" disabled={isLoadingCategories}>
                  <option value="">{isLoadingCategories ? 'Memuat...' : 'Pilih Kategori'}</option>
                  {categories?.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.categoryName}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-semibold">Maksimal Partisipan</label><input name="maxParticipants" type="number" value={formData.maxParticipants} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-semibold">Tanggal</label><input name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-semibold">Waktu</label><input name="eventTime" type="time" value={formData.eventTime} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
            </div>
            <div><label className="block text-sm font-semibold">Lokasi</label><input name="location" value={formData.location} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-semibold">Deskripsi</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-semibold">Yang Dibawa</label><textarea name="requiredItems" value={formData.requiredItems} onChange={handleChange} rows={4} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-semibold">Yang Disediakan</label><textarea name="providedItems" value={formData.providedItems} onChange={handleChange} rows={4} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-semibold">Gambar</label>
              <div className="mt-1 flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />}
                <label htmlFor="event-file-upload" className="flex-grow cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50">
                  <UploadCloud size={24} className="mb-2" />
                  <span>{imageFile ? imageFile.name : 'Ganti gambar'}</span>
                  <input id="event-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">Batal</button>
              <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400">
                {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default EditEventModal;
