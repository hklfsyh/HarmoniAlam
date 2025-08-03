import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadCloud } from 'lucide-react';


// --- Tipe Data ---
type Category = {
  category_id: number;
  categoryName: string;
};

// --- Props Komponen ---
interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: number | null;
  onSuccess: () => void;
  api: any; // Use 'any' for compatibility with ESM axios
  queryKeyToInvalidate: string;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ isOpen, onClose, articleId, onSuccess, api, queryKeyToInvalidate }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', category_id: '', summary: '', content: '', status: 'draft' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Tambahan untuk gallery
  const [gallery, setGallery] = useState<(File | null)[]>([null]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryIds, setGalleryIds] = useState<number[]>([]); // id gambar lama
  const [deleteGalleryImageIds, setDeleteGalleryImageIds] = useState<number[]>([]); // id gambar yang akan dihapus

  // --- Fungsi API (menggunakan prop 'api') ---
  const fetchArticleDetail = async (id: number) => {
    const { data } = await api.get(`/articles/${id}`);
    return data;
  };
  const fetchArticleCategories = async (): Promise<Category[]> => {
    const { data } = await api.get('/categories/articles');
    return data;
  };
  const updateArticle = async ({ id, formData }: { id: number, formData: FormData }) => {
    const { data } = await api.patch(`/articles/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  };

  const { data: articleData, isLoading: isLoadingArticle } = useQuery({
    queryKey: ['articleDetail', articleId],
    queryFn: () => fetchArticleDetail(articleId!),
    enabled: !!articleId && isOpen,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
      queryKey: ['articleCategories'],
      queryFn: fetchArticleCategories,
  });

  // Set data awal saat modal dibuka
  useEffect(() => {
    if (articleData) {
      setFormData({
        title: articleData.title,
        category_id: String(articleData.category?.category_id || ''),
        summary: articleData.summary,
        content: articleData.content,
        status: articleData.status || 'draft',
      });
      setImagePreview(articleData.imagePath);

      // Set gallery preview dari data lama
      if (Array.isArray(articleData.gallery) && articleData.gallery.length > 0) {
        setGallery(Array(articleData.gallery.length).fill(null));
        setGalleryPreviews(articleData.gallery.map((g: any) => g.url));
        setGalleryIds(articleData.gallery.map((g: any) => g.id)); // gunakan id dari response
      } else {
        setGallery([null]);
        setGalleryPreviews([]);
        setGalleryIds([]);
      }
      setDeleteGalleryImageIds([]);
    }
  }, [articleData]);

  const mutation = useMutation({
      mutationFn: updateArticle,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
          queryClient.invalidateQueries({ queryKey: ['articleDetail', articleId] });
          queryClient.invalidateQueries({ queryKey: ['myArticleDetail', articleId] });
          onSuccess();
      },
      onError: (error: any) => { alert(`Gagal memperbarui artikel: ${error.message}`); }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const fileType = file.type;
          const fileName = file.name.toLowerCase();
          
          // Validasi hanya JPG, JPEG, PNG yang diizinkan
          if (!fileType.startsWith('image/') || 
              (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png'))) {
            alert('Gambar harus berformat JPG, JPEG, atau PNG. Silakan pilih file dengan format yang sesuai.');
            e.target.value = ''; // Reset input file
            return;
          }
          
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
      }
  };

  // Gallery handler
  const handleGalleryChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      // Validasi hanya JPG, JPEG, PNG yang diizinkan
      if (!fileType.startsWith('image/') || 
          (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png'))) {
        alert('Gambar gallery harus berformat JPG, JPEG, atau PNG. Silakan pilih file dengan format yang sesuai.');
        e.target.value = ''; // Reset input file
        return;
      }
      
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

  const handleSubmit = (status: 'publish' | 'draft') => {
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('category_id', formData.category_id);
    submissionData.append('summary', formData.summary);
    submissionData.append('content', formData.content);
    submissionData.append('status', status);
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
    mutation.mutate({ id: articleId!, formData: submissionData });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A3A53] mb-4 sm:mb-6">Edit Artikel</h2>
        {isLoadingArticle ? <p>Memuat data artikel...</p> : (
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Judul Artikel</label>
                  <input name="title" value={formData.title} onChange={handleChange} className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Kategori Artikel</label>
                        <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full px-3 sm:px-4 py-2 border rounded-lg bg-white text-sm sm:text-base" disabled={isLoadingCategories}>
                            <option value="">{isLoadingCategories ? 'Memuat...' : 'Pilih Kategori'}</option>
                            {categories?.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.categoryName}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Ringkasan Artikel</label>
                  <textarea name="summary" value={formData.summary} onChange={handleChange} rows={3} className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Konten Artikel</label>
                  <textarea name="content" value={formData.content} onChange={handleChange} rows={6} className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"/>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Gambar</label>
                  <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {imagePreview && <img src={imagePreview} alt="Preview" className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg" />}
                    <label htmlFor="reusable-file-upload" className="flex-grow cursor-pointer flex flex-col items-center justify-center p-3 sm:p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50">
                      <UploadCloud size={20} className="mb-2"/>
                      <span className="text-xs sm:text-sm">{imageFile ? imageFile.name : 'Klik untuk mengganti gambar'}</span>
                      <input id="reusable-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,image/jpeg,image/png" />
                    </label>
                  </div>
                </div>

                {/* Gallery Edit */}
                <div>
                  <div className="block text-sm font-semibold mb-2">Gambar Gallery (maksimal 10 gambar)</div>
                  <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {/* Gallery lama (dari API) */}
                    {galleryPreviews.map((src, idx) => (
                      <div key={`existing-${src.substring(src.lastIndexOf('/') + 1)}`} className="flex flex-col items-center gap-2">
                        <img src={src} alt={`Preview Gallery ${idx + 1}`} className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg" />
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
                        <div key={`new-${idx}-${file?.name || 'empty'}`} className="flex flex-col items-center gap-2">
                          <label htmlFor={`gallery-upload-edit-${idx}`} className="cursor-pointer flex flex-col items-center justify-center p-2 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-slate-50 h-16 w-16 sm:h-20 sm:w-20">
                            <UploadCloud size={16} className="mb-1"/>
                            <span className="text-xs hidden sm:block">{file ? file.name.substring(0,8)+"..." : 'Pilih'}</span>
                            <input
                              id={`gallery-upload-edit-${idx}`}
                              type="file"
                              className="sr-only"
                              onChange={(e) => handleGalleryChange(idx, e)}
                              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
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
                  <button type="button" onClick={onClose} className="px-4 sm:px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100 text-sm sm:text-base">Batal</button>
                  <button type="button" onClick={() => handleSubmit('draft')} disabled={mutation.isPending} className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:bg-gray-200 text-sm sm:text-base">
                      {mutation.isPending ? 'Menyimpan...' : 'Simpan Draft'}
                  </button>
                  <button type="button" onClick={() => handleSubmit('publish')} disabled={mutation.isPending} className="px-4 sm:px-6 py-2 bg-[#79B829] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400 text-sm sm:text-base">
                      {mutation.isPending ? 'Menyimpan...' : 'Simpan Publish'}
                  </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};
export default EditArticleModal;
