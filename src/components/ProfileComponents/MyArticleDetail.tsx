import React from 'react';
import { useQuery } from '@tanstack/react-query';
import volunteerApi from '../../API/volunteer';
import { ArrowLeft, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';

// Fungsi untuk mengambil detail artikel dari API
const fetchArticleDetail = async (id: number) => {
    const { data } = await volunteerApi.get(`/articles/${id}`);
    return data;
};

interface MyArticleDetailProps {
  articleId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MyArticleDetail: React.FC<MyArticleDetailProps> = ({ articleId, onBack, onEdit, onDelete }) => {
    const { data: article, isLoading, isError, error } = useQuery({
        queryKey: ['myArticleDetail', articleId],
        queryFn: () => fetchArticleDetail(articleId),
        enabled: !!articleId,
    });

    const [galleryIdx, setGalleryIdx] = React.useState(0);

    if (isLoading) return <p className="text-center p-4">Memuat detail artikel...</p>;
    if (isError) return <p className="text-center p-4 text-red-500">Gagal memuat artikel: {error.message}</p>;

    const gallery = Array.isArray(article.gallery) ? article.gallery : [];

    const prevGallery = () => setGalleryIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    const nextGallery = () => setGalleryIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

    return (
        <div>
            {/* Header Detail Artikel */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold">
                    <ArrowLeft size={20} />
                    Kembali ke Daftar Artikel
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(article.article_id)} className="text-xs border px-3 py-1 rounded-md hover:bg-gray-100">Edit</button>
                    <button onClick={() => onDelete(article.article_id)} className="text-xs border px-3 py-1 rounded-md text-red-600 border-red-300 hover:bg-red-50">Hapus</button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <span className="bg-[#79B829] bg-opacity-20 text-white font-semibold px-3 py-1 rounded-full text-sm">
                        {article.category.categoryName}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-[#1A3A53]">{article.title}</h1>
                <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-2"><Calendar size={18} /><span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span></div>
                    <div className="flex items-center gap-2"><User size={18} /><span>{article.authorName}</span></div>
                </div>
            </div>

            {/* Konten Artikel */}
            <div className="my-8">
                <img src={article.imagePath} alt={article.title} className="w-full h-auto max-h-[400px] object-cover rounded-lg" />
            </div>
            <article className="prose max-w-none">
                <p className="font-semibold italic text-gray-600">{article.summary}</p>
                <div className="whitespace-pre-line text-gray-700">
                    {article.content}
                </div>
            </article>

            {/* Gallery Section */}
            {gallery.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-bold text-[#1A3A53] mb-4 text-center">Galeri Artikel</h2>
                    <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow border bg-white flex justify-center">
                            <img
                                src={gallery[galleryIdx]}
                                alt={`Galeri Artikel ${galleryIdx + 1}`}
                                className="w-full h-80 object-cover transition-all duration-300"
                                loading="lazy"
                            />
                        </div>
                        {gallery.length > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button
                                    onClick={prevGallery}
                                    className="p-2 rounded-full bg-[#eaf6e9] hover:bg-[#79B829] text-[#1A3A53] hover:text-white transition"
                                    aria-label="Sebelumnya"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <span className="text-sm text-gray-600">
                                    {galleryIdx + 1} / {gallery.length}
                                </span>
                                <button
                                    onClick={nextGallery}
                                    className="p-2 rounded-full bg-[#eaf6e9] hover:bg-[#79B829] text-[#1A3A53] hover:text-white transition"
                                    aria-label="Selanjutnya"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                        <div className="flex gap-2 mt-3 justify-center">
                            {gallery.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setGalleryIdx(idx)}
                                    className={`w-3 h-3 rounded-full transition-all border ${galleryIdx === idx ? "bg-[#79B829] border-[#79B829]" : "bg-gray-300 border-gray-300"}`}
                                    aria-label={`Pilih gambar ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyArticleDetail;
