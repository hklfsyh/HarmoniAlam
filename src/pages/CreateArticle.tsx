import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../API/admin';
import SuccessModal from '../components/SuccessModal';

type Category = {
  category_id: number;
  categoryName: string;
};

const fetchArticleCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories/articles');
  return data;
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    onError: (error: any) => {
      alert(`Terjadi kesalahan: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
  };

  const handleSubmit = (status: 'publish' | 'draft') => {
    if (!image || !categoryId || !title) {
      alert('Judul, Kategori, dan Gambar wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('image', image);
    formData.append('status', status);
    
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
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-grow container mx-auto px-6 py-12 mt-16">
          <div className="max-w-3xl mx-auto">
            {backPath ? (
              <Link to={backPath} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-6">
                <ArrowLeft size={20} />
                {backText}
              </Link>
            ) : (
              <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-[#79B829]">
                  Tulis Artikel Lingkungan
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Bagikan pengetahuan dan tips tentang lingkungan kepada komunitas melalui artikel yang informatif
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
             <h2 className="text-2xl font-bold text-[#1A3A53] mb-8">Tulis Artikel Baru</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Judul Artikel</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Kategori Artikel</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="" disabled>{isLoadingCategories ? 'Memuat...' : 'Pilih Kategori'}</option>
                  {categories?.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Ringkasan Artikel</label>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required rows={4} className="w-full px-4 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Konten Artikel</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={8} className="w-full px-4 py-2 border rounded-lg"/>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Gambar</label>
                <div className="mt-1 flex items-center gap-4">
                  {imagePreview && <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />}
                  <label htmlFor="file-upload" className="flex-grow cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50">
                    <UploadCloud size={24} className="mb-2"/>
                    <span>{image ? image.name : 'Klik untuk memilih gambar'}</span>
                    <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} required accept="image/*" />
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={handleReset} className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100">Batal</button>
                <button type="button" onClick={() => handleSubmit('draft')} disabled={mutation.isPending} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:bg-gray-200">
                    {mutation.isPending ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <button type="button" onClick={() => handleSubmit('publish')} disabled={mutation.isPending} className="px-6 py-2 bg-[#79B829] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400">
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
    </>
  );
};

export default CreateArticlePage;
