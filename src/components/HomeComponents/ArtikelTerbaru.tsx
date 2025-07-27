import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import publicApi from '../../API/publicApi';

// Fungsi untuk mengambil data artikel terbaru dari API
const fetchLatestArticles = async () => {
    const { data } = await publicApi.get('/articles/latest');
    return data;
};

const ArtikelTerbaru: React.FC = () => {
    const { data: articles, isLoading, isError, error } = useQuery({
        queryKey: ['latestArticles'],
        queryFn: fetchLatestArticles,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-6">
                
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1A3A53]">Artikel Terbaru</h2>
                    <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                        Baca artikel terbaru seputar lingkungan dan tips menjaga kebersihan alam
                    </p>
                </div>

                {isLoading && <p className="text-center">Memuat artikel terbaru...</p>}
                {isError && <p className="text-center text-red-500">Gagal memuat artikel: {error.message}</p>}

                {articles && (
                    <div className="flex flex-wrap justify-center gap-8">
                        {articles.slice(0, 3).map((article: any) => (
                            <div key={article.article_id} className="w-full md:w-1/2 lg:w-[30%] rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col bg-white">
                                <div className="relative">
                                    <img src={article.image} alt={article.title} className="w-full h-56 object-cover" />
                                    <div className="absolute top-4 right-4 bg-[#79B829] bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {article.category.categoryName}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-[#1A3A53] mb-2">{article.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 flex-grow">{article.summary}</p>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-auto mb-4">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(article.createdAt)}</span>
                                    </div>
                                    <Link 
                                        to={`/artikel/detail/${article.article_id}`}
                                        className="w-full text-center bg-[#79B829] text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                    >
                                        Baca Selengkapnya
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link to="/artikel" className="inline-flex items-center gap-2 px-6 py-3 border border-[#79B829] text-[#79B829] font-semibold rounded-lg hover:bg-[#79B829] hover:text-white transition-colors">
                        Lihat Semua Artikel
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ArtikelTerbaru;
