// src/components/AdminComponents/AdminArticleDetailView.tsx
import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';

interface AdminArticleDetailViewProps {
  onBack: () => void;
  onEdit: () => void;
}

const AdminArticleDetailView: React.FC<AdminArticleDetailViewProps> = ({ onBack, onEdit }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold">
          <ArrowLeft size={20} />
          Kembali ke Dashboard
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="bg-[#79B829] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90">
            Edit Artikel
          </button>
          <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700">
            Hapus Artikel
          </button>
        </div>
      </div>

      {/* Info Artikel */}
      <div className="space-y-4">
        <div>
          <span className="bg-[#79B829] bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Tips Lingkungan
          </span>
        </div>
        <h1 className="text-4xl font-bold text-[#1A3A53]">
          Dampak Perubahan Iklim terhadap Ekosistem Pantai Jakarta
        </h1>
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={18} /><span>20 Juli 2024</span>
        </div>
      </div>
      
      {/* Gambar */}
      <div className="my-8">
        <img src="/imageTemplateArticle.png" alt="Article visual" className="w-full h-auto max-h-[450px] object-cover rounded-lg" />
      </div>

      {/* Konten Artikel */}
      <article className="prose lg:prose-lg max-w-none">
        <p>
          Perubahan iklim telah menjadi salah satu tantangan terbesar yang dihadapi ekosistem pantai Jakarta. Kenaikan permukaan air laut, perubahan pola curah hujan, dan meningkatnya suhu global memberikan dampak signifikan terhadap kehidupan biota laut dan kondisi ekosistem pesisir.
        </p>
        <p>
          Pantai Jakarta yang dulunya kaya akan ekosistem mangrove kini mengalami degradasi yang sangat mengkhawatirkan. Abrasi pantai semakin parah akibat aktivitas manusia dan faktor alam yang berubah. Hal ini tidak hanya mempengaruhi kehidupan biota laut, tetapi juga mata pencaharian masyarakat pesisir.
        </p>
      </article>
    </div>
  );
};

export default AdminArticleDetailView;