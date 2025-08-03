import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../API/admin';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

type Category = {
  category_id: number;
  categoryName: string;
};

const fetchArticleCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<{ articles: Category[] }>('/categories/articles');
  return data.articles;
};

const createArticle = async (formData: FormData) => {
  const { data } = await api.post('/articles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const CreateArticlePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<(File | null)[]>([null]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['articleCategories'],
    queryFn: fetchArticleCategories,
  });

  const mutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminArticles', 'organizerArticles'] });
      const status = variables.get('status');
      setSuccessMessage(status === 'draft' ? 'Artikel berhasil disimpan sebagai draft.' : 'Artikel berhasil dipublikasikan.');
      setIsSuccessModalOpen(true);
    },
    onError: (error: unknown) => {
      let message = 'Terjadi kesalahan saat membuat artikel.';
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = (error as { message?: string }).message || message;
      }
      setErrorMessage(message);
      setIsErrorModalOpen(true);
    },
  });

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

  const handleSubmit = (status: 'publish' | 'draft') => {
    if (!title.trim() || !summary.trim() || !content.trim() || !categoryId || !image) {
      setErrorMessage('Semua field wajib diisi. Judul, Kategori, Ringkasan, Konten, dan Gambar tidak boleh kosong.');
      setIsErrorModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('image', image);
    formData.append('status', status);

    // Tambahkan gallery files (hanya yang terisi)
    gallery.forEach((file) => {
      if (file) formData.append('gallery', file);
    });

    mutation.mutate(formData);
  };

  let backPath = '';
  let backText = '';

  if (location.pathname.startsWith('/admin')) {
    backPath = '/admin';
    backText = 'Kembali ke Dashboard Admin';
  } else if (location.pathname.startsWith('/dashboard')) {
    backPath = '/organizer';
    backText = 'Kembali ke Dashboard';
  }
  
  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate(backPath || '/');
  };

  const handleReset = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setCategoryId('');
    setImage(null);
    setImagePreview(null);
    setGallery([null]);
    setGalleryPreviews([]);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-16">
          <div className="max-w-3xl mx-auto">
            {backPath ? (
              <Link to={backPath} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-4 sm:mb-6">
                <ArrowLeft size={20} />
                {backText}
              </Link>
            ) : (
              <div className="text-center mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#79B829]">
                  Tulis Artikel Lingkungan
                </h1>
                <p className="mt-3 text-base sm:text-lg text-gray-600">
                  Bagikan pengetahuan dan tips tentang lingkungan kepada komunitas melalui artikel yang informatif
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
             <h2 className="text-xl sm:text-2xl font-bold text-[#1A3A53] mb-6 sm:mb-8">Tulis Artikel Baru</h2>
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Judul Artikel</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Kategori Artikel</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full px-3 sm:px-4 py-2 border rounded-lg bg-white text-sm sm:text-base">
                  <option value="" disabled>{isLoadingCategories ? 'Memuat...' : 'Pilih Kategori'}</option>
                  {categories?.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Ringkasan Artikel</label>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required rows={3} className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Konten Artikel</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={6} className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Gambar</label>
                <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {imagePreview && <img src={imagePreview} alt="Preview" className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg" />}
                  <label htmlFor="file-upload" className="flex-grow cursor-pointer flex flex-col items-center justify-center p-3 sm:p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50">
                    <UploadCloud size={20} className="mb-2"/>
                    <span className="text-xs sm:text-sm">{image ? image.name : 'Klik untuk memilih gambar'}</span>
                    <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} required accept="image/*" />
                  </label>
                </div>
              </div>

              <div>
                <div className="block text-sm font-semibold mb-2">Gambar Gallery (maksimal 10 gambar)</div>
                <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {gallery.map((file, idx) => (
                    <div key={`gallery-${idx}`} className="flex flex-col items-center gap-2">
                      {galleryPreviews[idx] && (
                        <img src={galleryPreviews[idx]} alt={`Preview Gallery ${idx + 1}`} className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg" />
                      )}
                      <label htmlFor={`gallery-upload-${idx}`} className="cursor-pointer flex flex-col items-center justify-center p-2 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50 h-16 w-16 sm:h-20 sm:w-20">
                        <UploadCloud size={16} className="mb-1"/>
                        <span className="text-xs hidden sm:block">{file ? file.name.substring(0,8)+"..." : 'Pilih'}</span>
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
                      className="flex flex-col items-center justify-center p-2 border-2 border-dashed rounded-lg text-gray-500 hover:bg-slate-50 h-16 w-16 sm:h-20 sm:w-20"
                      title="Tambah gambar gallery"
                    >
                      <span className="text-xl sm:text-2xl font-bold">+</span>
                      <span className="text-xs hidden sm:block">Tambah</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                <button type="button" onClick={handleReset} className="px-4 sm:px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100 text-sm sm:text-base">Batal</button>
                <button type="button" onClick={() => handleSubmit('draft')} disabled={mutation.isPending} className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:bg-gray-200 text-sm sm:text-base">
                    {mutation.isPending ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <button type="button" onClick={() => handleSubmit('publish')} disabled={mutation.isPending} className="px-4 sm:px-6 py-2 bg-[#79B829] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400 text-sm sm:text-base">
                    {mutation.isPending ? 'Memublikasikan...' : 'Publikasikan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={handleModalClose}
        title="Berhasil!"
        message={successMessage}
        buttonText="Selesai"
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Gagal!"
        message={errorMessage}
        buttonText="Tutup"
      />
    </>
  );
};

export default CreateArticlePage;
