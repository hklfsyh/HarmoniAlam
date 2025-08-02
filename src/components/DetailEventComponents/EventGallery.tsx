import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventGalleryProps {
  gallery: string[];
}

const EventGallery: React.FC<EventGalleryProps> = ({ gallery }) => {
  const [current, setCurrent] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  const prevImage = () => setCurrent((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const nextImage = () => setCurrent((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  return (
    <div className="mb-10 pt-8 w-full">
      <h2 className="text-xl font-bold text-[#1A3A53] mb-4 text-center">Galeri Event</h2>
      <div className="relative flex flex-col items-center justify-center w-full">
        <div className="w-full rounded-xl overflow-hidden shadow border bg-white flex justify-center">
          <img
            src={gallery[current]}
            alt={`Galeri Event ${current + 1}`}
            className="w-full h-80 object-cover transition-all duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/no-image.png";
            }}
          />
        </div>
        {gallery.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={prevImage}
              className="p-2 rounded-full bg-[#eaf6e9] hover:bg-[#79B829] text-[#1A3A53] hover:text-white transition"
              aria-label="Sebelumnya"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm text-gray-600">
              {current + 1} / {gallery.length}
            </span>
            <button
              onClick={nextImage}
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
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all border ${current === idx ? "bg-[#79B829] border-[#79B829]" : "bg-gray-300 border-gray-300"}`}
              aria-label={`Pilih gambar ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventGallery;