import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { UploadCloud } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Tipe Data
type Category = {
  category_id: number;
  categoryName: string;
};

interface GalleryImage {
  id: number;
  url: string;
}

// Event Data Type
interface EventDetail {
  title: string;
  category?: {
    category_id: number;
    categoryName: string;
  };
  maxParticipants: string;
  eventDate?: string;
  eventTime?: string;
  location: string;
  description: string;
  requiredItems: string;
  providedItems: string;
  imagePath?: string;
  latitude?: string;
  longitude?: string;
  gallery?: GalleryImage[];
}

// Fungsi API
const fetchEventDetail = async (id: number): Promise<EventDetail> => {
  const { data } = await organizerApi.get(`/events/${id}`);
  return data as EventDetail;
};
const fetchEventCategories = async (): Promise<Category[]> => {
  const { data } = await organizerApi.get('/categories/events');
  return data as Category[];
};
const updateEvent = async ({ id, formData }: { id: number, formData: FormData }) => {
  const { data } = await organizerApi.patch(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Custom marker icon supaya muncul di leaflet
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationPicker({ latitude, longitude, setLatitude, setLongitude }: any) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat.toString());
      setLongitude(e.latlng.lng.toString());
    },
  });

  return latitude && longitude ? (
    <Marker position={[parseFloat(latitude), parseFloat(longitude)]} icon={markerIcon} />
  ) : null;
}

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

  // Gallery states
  const [gallery, setGallery] = useState<(File | null)[]>([null]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryIds, setGalleryIds] = useState<number[]>([]);
  const [deleteGalleryImageIds, setDeleteGalleryImageIds] = useState<number[]>([]);

  // Koordinat
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const { data: eventData, isLoading } = useQuery<EventDetail>({
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
        title: eventData?.title || '',
        category_id: String(eventData?.category?.category_id || ''),
        maxParticipants: eventData?.maxParticipants || '',
        eventDate: eventData?.eventDate ? new Date(eventData.eventDate).toISOString().split('T')[0] : '',
        eventTime: eventData?.eventTime ? new Date(eventData.eventTime).toISOString().split('T')[1].substring(0, 5) : '',
        location: eventData?.location || '',
        description: eventData?.description || '',
        requiredItems: eventData?.requiredItems || '',
        providedItems: eventData?.providedItems || '',
      });
      setImagePreview(eventData?.imagePath || null);

      // Set gallery preview dari data lama
      if (Array.isArray(eventData.gallery) && eventData.gallery.length > 0) {
        setGallery(Array(eventData.gallery.length).fill(null));
        setGalleryPreviews(eventData.gallery.map((g: any) => g.url));
        setGalleryIds(eventData.gallery.map((g: any) => g.id));
      } else {
        setGallery([null]);
        setGalleryPreviews([]);
        setGalleryIds([]);
      }
      setDeleteGalleryImageIds([]);

      // Set koordinat
      setLatitude(eventData.latitude || '');
      setLongitude(eventData.longitude || '');
    }
  }, [eventData]);

  const mutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      queryClient.invalidateQueries({ queryKey: ['organizerEventDetail', eventId] });
      onSuccess();
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'message' in error) {
        alert(`Gagal memperbarui event: ${(error as { message: string }).message}`);
      } else {
        alert('Gagal memperbarui event.');
      }
    }
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

  // Gallery handler
  const handleGalleryChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newGallery = [...gallery];
      newGallery[idx] = file;
      setGallery(newGallery);

      const newPreviews = [...galleryPreviews];
      newPreviews[idx] = URL.createObjectURL(file);
      setGalleryPreviews(newPreviews);
    }
  };

  const handleAddGalleryInput = () => {
    if (gallery.length + galleryPreviews.length < 10) {
      setGallery([...gallery, null]);
      setGalleryPreviews([...galleryPreviews, ""]);
    }
  };

  // Hapus gambar gallery lama
  const handleRemoveOldGalleryImage = (idx: number) => {
    if (galleryIds[idx]) {
      setDeleteGalleryImageIds([...deleteGalleryImageIds, galleryIds[idx]]);
    }
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx));
    setGalleryIds(galleryIds.filter((_, i) => i !== idx));
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  // Hapus gambar gallery baru (belum upload)
  const handleRemoveGalleryInput = (idx: number) => {
    if (gallery.length > 1) {
      setGallery(gallery.filter((_, i) => i !== idx));
      setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    submissionData.append('latitude', latitude);
    submissionData.append('longitude', longitude);

    if (imageFile) {
      submissionData.append('image', imageFile);
    }
    // Tambahkan gallery files (hanya yang terisi)
    gallery.forEach((file) => {
      if (file) submissionData.append('gallery', file);
    });
    // Tambahkan id gambar gallery yang dihapus
    if (deleteGalleryImageIds.length > 0) {
      submissionData.append('deleteGalleryImageIds', JSON.stringify(deleteGalleryImageIds));
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
            {/* Gallery Edit */}
            <div>
              <label className="block text-sm font-semibold mb-2">Gambar Gallery (maksimal 10 gambar)</label>
              <div className="mt-1 flex flex-wrap gap-4">
                {/* Gallery lama (dari API) */}
                {galleryPreviews.map((src, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <img src={src} alt={`Preview Gallery ${idx + 1}`} className="h-20 w-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleRemoveOldGalleryImage(idx)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                {/* Gallery baru (belum upload) */}
                {gallery.map((file, idx) => (
                  !galleryPreviews[idx] && (
                    <div key={`new-${idx}`} className="flex flex-col items-center gap-2">
                      <label htmlFor={`gallery-upload-edit-${idx}`} className="cursor-pointer flex flex-col items-center justify-center p-2 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50 min-w-[100px]">
                        <UploadCloud size={20} className="mb-1"/>
                        <span className="text-xs">{file ? file.name : 'Pilih gambar'}</span>
                        <input
                          id={`gallery-upload-edit-${idx}`}
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleGalleryChange(idx, e)}
                          accept="image/*"
                        />
                      </label>
                      {gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryInput(idx)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  )
                ))}
                {gallery.length + galleryPreviews.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddGalleryInput}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg text-gray-500 hover:bg-slate-50 min-w-[100px] h-20"
                    title="Tambah gambar gallery"
                  >
                    <span className="text-3xl font-bold">+</span>
                    <span className="text-xs mt-1">Tambah Gambar</span>
                  </button>
                )}
              </div>
            </div>
            {/* Map Edit */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tandai Lokasi Event di Map</label>
              <div className="mb-2">
                <MapContainer
                  center={latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [-6.2, 106.8]}
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                  />
                </MapContainer>
              </div>
              <div className="flex gap-4 mt-2">
                <input type="text" name="latitude" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Latitude" className="px-4 py-2 border rounded-lg" required />
                <input type="text" name="longitude" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Longitude" className="px-4 py-2 border rounded-lg" required />
              </div>
              <p className="text-xs text-gray-500 mt-1">Klik pada map untuk memilih lokasi event. Latitude dan longitude akan terisi otomatis.</p>
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
