import React, { useState } from 'react';

interface ArticleGalleryProps {
  gallery: string[];
}

const ArticleGallery: React.FC<ArticleGalleryProps> = ({ gallery }) => {
  const [current, setCurrent] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="mb-10 pt-8 w-full">
      <h3 className="text-xl font-bold text-[#1A3A53] mb-4">Galeri Artikel</h3>
      <div className="relative flex flex-col items-center justify-center w-full">
        <div className="w-full rounded-xl overflow-hidden shadow border bg-white flex justify-center">
          <img
            src={gallery[current]}
            alt={`Galeri Artikel ${current + 1}`}
            className="w-full h-80 object-cover transition-all duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/no-image.png";
            }}
          />
        </div>
        {gallery.length > 1 && (
          <div className="flex gap-2 mt-4">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === current ? 'bg-[#79B829]' : 'bg-gray-300'}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Lihat gambar ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleGallery;