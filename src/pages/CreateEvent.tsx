import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import organizerApi from '../API/organizer';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Tipe Data untuk Kategori
type Category = {
  category_id: number;
  categoryName: string;
};

// Fungsi untuk mengambil kategori event dari API
const fetchEventCategories = async (): Promise<Category[]> => {
  const { data } = await organizerApi.get('/categories/events');
  return data;
};

// Fungsi untuk membuat event baru (POST request)
const createEvent = async (formData: FormData) => {
  const { data } = await organizerApi.post('/events', formData, {
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

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State untuk semua field form
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<(File | null)[]>([null]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Ambil data kategori untuk dropdown
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['eventCategories'],
    queryFn: fetchEventCategories,
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizerEvents'] });
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || error.message || 'Gagal membuat event');
      setIsErrorModalOpen(true);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
    if (gallery.length < 10) {
      setGallery([...gallery, null]);
      setGalleryPreviews([...galleryPreviews, ""]);
    }
  };

  const handleRemoveGalleryInput = (idx: number) => {
    if (gallery.length > 1) {
      const newGallery = gallery.filter((_, i) => i !== idx);
      const newPreviews = galleryPreviews.filter((_, i) => i !== idx);
      setGallery(newGallery);
      setGalleryPreviews(newPreviews);
    }
  };

  // Validasi form
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.title.trim()) errors.title = "Judul event wajib diisi";
    if (!formData.category_id) errors.category_id = "Kategori event wajib dipilih";
    if (!formData.maxParticipants || Number(formData.maxParticipants) < 1) errors.maxParticipants = "Jumlah partisipan minimal 1";
    if (!formData.eventDate) errors.eventDate = "Tanggal event wajib diisi";
    if (!formData.eventTime) errors.eventTime = "Waktu event wajib diisi";
    if (!formData.location.trim()) errors.location = "Lokasi event wajib diisi";
    if (!formData.description.trim()) errors.description = "Deskripsi event wajib diisi";
    if (!formData.requiredItems.trim()) errors.requiredItems = "Kebutuhan yang harus dibawa wajib diisi";
    if (!formData.providedItems.trim()) errors.providedItems = "Kebutuhan yang disediakan wajib diisi";
    if (!latitude || !longitude) errors.locationMap = "Lokasi map wajib dipilih";
    if (!image) errors.image = "Gambar utama wajib diisi";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('category_id', formData.category_id);
    submissionData.append('maxParticipants', formData.maxParticipants);
    submissionData.append('eventDate', formData.eventDate);
    submissionData.append('eventTime', formData.eventTime);
    submissionData.append('location', formData.location);
    submissionData.append('description', formData.description);
    submissionData.append('requiredItems', formData.requiredItems);
    submissionData.append('providedItems', formData.providedItems);
    submissionData.append('latitude', latitude);
    submissionData.append('longitude', longitude);

    if (image) {
      submissionData.append('image', image);
    }
    gallery.forEach((file) => {
      if (file) submissionData.append('gallery', file);
    });

    mutation.mutate(submissionData);
  };

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/organizer');
  };

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <>
      <div className="bg-slate-50 min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-16">
          <div className="max-w-3xl mx-auto">
            <Link to="/organizer" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4 sm:mb-6">
              <ArrowLeft size={20} />
              Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A3A53]">Buat Event Lingkungan</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Buat event lingkungan baru dan ajak komunitas untuk berpartisipasi.</p>
          </div>

          <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl shadow-lg w-full max-w-3xl mx-auto mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A3A53] mb-6 sm:mb-8">Buat Event Baru</h2>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold mb-2">Judul Event</label>
                <input name="title" onChange={handleChange} required className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
                {formErrors.title && <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Kategori Event</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg bg-white text-sm sm:text-base"
                  >
                    <option value="" hidden>Pilih Kategori</option>
                    {categories?.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {formErrors.category_id && <p className="text-xs text-red-600 mt-1">{formErrors.category_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Maksimal Partisipan</label>
                  <input name="maxParticipants" type="number" onChange={handleChange} required className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
                  {formErrors.maxParticipants && <p className="text-xs text-red-600 mt-1">{formErrors.maxParticipants}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Tanggal Event</label>
                  <input name="eventDate" type="date" onChange={handleChange} required className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
                  {formErrors.eventDate && <p className="text-xs text-red-600 mt-1">{formErrors.eventDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Waktu Event</label>
                  <input name="eventTime" type="time" onChange={handleChange} required className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
                  {formErrors.eventTime && <p className="text-xs text-red-600 mt-1">{formErrors.eventTime}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold">Lokasi Event</label>
                <input name="location" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg"/>
                {formErrors.location && <p className="text-xs text-red-600 mt-1">{formErrors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold">Deskripsi Event</label>
                <textarea name="description" onChange={handleChange} required rows={4} className="w-full px-4 py-2 border rounded-lg"/>
                {formErrors.description && <p className="text-xs text-red-600 mt-1">{formErrors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold">Kebutuhan yang Harus Dibawa</label>
                <textarea name="requiredItems" onChange={handleChange} required rows={4} className="w-full px-4 py-2 border rounded-lg"/>
                {formErrors.requiredItems && <p className="text-xs text-red-600 mt-1">{formErrors.requiredItems}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold">Kebutuhan yang Disediakan</label>
                <textarea name="providedItems" onChange={handleChange} required rows={4} className="w-full px-4 py-2 border rounded-lg"/>
                {formErrors.providedItems && <p className="text-xs text-red-600 mt-1">{formErrors.providedItems}</p>}
              </div>
              
              {/* --- UI UPLOAD GAMBAR DIPERBARUI --- */}
              <div>
                <label className="block text-sm font-semibold mb-2">Gambar</label>
                <div className="mt-1 flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                  )}
                  <label htmlFor="file-upload" className="flex-grow cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50">
                    <UploadCloud size={24} className="mb-2"/>
                    <span>{image ? image.name : 'Klik untuk memilih gambar'}</span>
                    <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} required accept="image/*" />
                  </label>
                </div>
                {formErrors.image && <p className="text-xs text-red-600 mt-1">{formErrors.image}</p>}
              </div>

              {/* --- UI UPLOAD GALERI GAMBAR --- */}
              <div>
                <label className="block text-sm font-semibold mb-2">Gambar Gallery (maksimal 10 gambar)</label>
                <div className="mt-1 flex flex-wrap gap-4">
                  {gallery.map((file, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      {galleryPreviews[idx] && (
                        <img src={galleryPreviews[idx]} alt={`Preview Gallery ${idx + 1}`} className="h-20 w-20 object-cover rounded-lg" />
                      )}
                      <label htmlFor={`gallery-upload-${idx}`} className="cursor-pointer flex flex-col items-center justify-center p-2 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50 min-w-[100px]">
                        <UploadCloud size={20} className="mb-1"/>
                        <span className="text-xs">{file ? file.name : 'Pilih gambar'}</span>
                        <input
                          id={`gallery-upload-${idx}`}
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
                  ))}
                  {gallery.length < 10 && (
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

              {/* --- INPUT KOORDINAT --- */}
              <div>
                <label className="block text-sm font-semibold mb-2">Tandai Lokasi Event di Map</label>
                <div className="mb-2">
                  <MapContainer
                    center={[-6.2, 106.8]}
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
                {formErrors.locationMap && <p className="text-xs text-red-600 mt-1">{formErrors.locationMap}</p>}
                <p className="text-xs text-gray-500 mt-1">Klik pada map untuk memilih lokasi event. Latitude dan longitude akan terisi otomatis.</p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="reset" className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">Reset Form</button>
                <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-[#1A3A53] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400">
                  {mutation.isPending ? 'Membuat Event...' : 'Buat Event'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={handleModalClose}
        title="Event Berhasil Dibuat!"
        message="Event baru Anda telah berhasil disimpan dan akan ditampilkan di halaman event."
        buttonText="Selesai"
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorModalClose}
        title="Gagal Membuat Event"
        message={errorMessage}
      />
    </>
  );
};

export default CreateEventPage;
