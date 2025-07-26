import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Search, Calendar } from 'lucide-react';
import organizerApi from '../../API/organizer';

// Fungsi untuk mengambil data artikel milik organizer
const fetchMyArticles = async () => {
    const { data } = await organizerApi.get('/articles/my-articles');
    return data.articles; // Mengambil array 'articles' dari response
};

interface TotalArtikelTabProps {
    onViewClick: (id: number) => void;
}

const TotalArtikelTab: React.FC<TotalArtikelTabProps> = ({ onViewClick }) => {
    const { data: articles, isLoading, isError, error } = useQuery({
        queryKey: ['myArticles'],
        queryFn: fetchMyArticles,
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Cari Artikel..." className="w-full pl-12 pr-4 py-3 border rounded-lg" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Artikel Saya</h2>

            {isLoading && <p>Memuat data artikel...</p>}
            {isError && <p className="text-red-500">Terjadi kesalahan: {error.message}</p>}

            {articles && (
                <div className="border rounded-lg text-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1A3A53] text-white font-semibold uppercase tracking-wider text-xs">
                        <div className="col-span-6">Artikel</div>
                        <div className="col-span-3">Kategori</div>
                        <div className="col-span-2">Tanggal</div>
                        <div className="col-span-1 text-right">Aksi</div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                        {articles.length > 0 ? (
                            articles.map((article: any) => (
                                <div key={article.article_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                                    <div className="col-span-6">
                                        <p className="font-bold text-[#1A3A53]">{article.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{article.summary}</p>
                                    </div>
                                    <div className="col-span-3 text-gray-700">{article.category.categoryName}</div>
                                    <div className="col-span-2 text-gray-500 flex items-center gap-2">
                                        <Calendar size={16}/>
                                        {new Date(article.createdAt).toLocaleDateString('id-ID')}
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end gap-2 text-gray-500">
                                        <button onClick={() => onViewClick(article.article_id)} className="p-1.5 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors"><Eye size={18}/></button>
                                        <button className="p-1.5 rounded-md hover:bg-slate-100 hover:text-green-600 transition-colors"><Pencil size={18}/></button>
                                        <button className="p-1.5 rounded-md hover:bg-slate-100 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500">Anda belum membuat artikel.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default TotalArtikelTab;
