// src/components/HomeComponents/ArtikelTerbaru.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Contoh data artikel
const articleData = [
  {
    title: '10 Cara Sederhana untuk Mengurangi Dampak Lingkungan Anda',
    excerpt: 'Perubahan kecil dalam kebiasaan harian yang membuat perbedaan besar bagi planet.',
    date: '8 Juli 2025',
    readTime: '5 menit membaca',
    imageUrl: '/imageTemplateArticle.png',
  },
  {
    title: '10 Cara Sederhana untuk Mengurangi Dampak Lingkungan Anda',
    excerpt: 'Perubahan kecil dalam kebiasaan harian yang membuat perbedaan besar bagi planet.',
    date: '8 Juli 2025',
    readTime: '5 menit membaca',
    imageUrl: '/imageTemplateArticle.png',
  },
];

const ArtikelTerbaru: React.FC = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3A53]">Artikel Terbaru</h2>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Baca artikel terbaru seputar lingkungan dan tips menjaga kebersihan alam
          </p>
        </div>

        {/* Grid for Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {articleData.map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              {/* Card Image */}
              <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover" />

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#1A3A53]">{article.title}</h3>
                <p className="mt-2 text-gray-600 flex-grow">{article.excerpt}</p>

                {/* Meta Info */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>

                {/* Read More Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a href="#" className="text-center block text-[#79B829] font-bold hover:underline">
                    Baca Selengkapnya
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* "Lihat Semua" Button */}
        <div className="text-center mt-12">
          <Link to="/artikel">
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-[#79B829] text-[#79B829] font-semibold rounded-lg hover:bg-[#79B829] hover:text-white transition-colors">
              Lihat Semua Artikel
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ArtikelTerbaru;