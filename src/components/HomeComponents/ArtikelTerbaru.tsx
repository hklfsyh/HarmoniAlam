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
        <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#1A3A53]">
                        Artikel Terbaru
                    </h2>
                    <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-4 sm:px-0">
                        Baca artikel terbaru seputar lingkungan dan tips menjaga kebersihan alam
                    </p>
                </div>

                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#79B829]"></div>
                        <p className="mt-2 text-gray-600">Memuat artikel terbaru...</p>
                    </div>
                )}
                
                {isError && (
                    <p className="text-center text-red-500 py-8">
                        Gagal memuat artikel: {error.message}
                    </p>
                )}

                {Array.isArray(articles) && articles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {articles.slice(0, 3).map((article: any) => (
                      <div key={article.article_id} className="rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col bg-white">
                        <div className="relative">
                          <img src={article.image} alt={article.title} className="w-full h-48 sm:h-56 object-cover" />
                          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#79B829] bg-opacity-80 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-light">
                            {article.category?.categoryName ?? '-'}
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 flex flex-col flex-grow">
                          <h3 className="text-lg sm:text-xl font-normal text-[#1A3A53] mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 flex-grow font-light line-clamp-3">
                            {article.summary}
                          </p>
                          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mt-auto mb-4 font-light">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{formatDate(article.createdAt)}</span>
                          </div>
                          <Link
                            to={`/artikel/detail/${article.article_id}`}
                            className="w-full text-center bg-[#79B829] text-white font-normal py-2 sm:py-2.5 rounded-lg hover:bg-opacity-90 transition-colors text-sm sm:text-base"
                          >
                            Baca Selengkapnya
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center mt-8 sm:mt-10 lg:mt-12">
                    <Link 
                        to="/artikel" 
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-[#79B829] text-[#79B829] font-normal rounded-lg hover:bg-[#79B829] hover:text-white transition-colors text-sm sm:text-base"
                    >
                        Lihat Semua Artikel
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ArtikelTerbaru;
