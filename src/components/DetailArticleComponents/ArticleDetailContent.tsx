// src/components/DetailArticleComponents/ArticleDetailContent.tsx
import React from 'react';

const ArticleDetailContent: React.FC = () => {
  return (
    // Kelas 'prose' dari plugin typography akan menata semua elemen di dalamnya secara otomatis
    <article className="prose lg:prose-lg max-w-none mt-8">
      <p>
        Sampah plastik merupakan salah satu masalah lingkungan terbesar di dunia saat ini. Setiap tahun, jutaan ton plastik berakhir di lautan dan mencemari ekosistem kita. Namun, kita dapat memulai perubahan dari rumah sendiri dengan menerapkan tips-tips sederhana berikut.
      </p>
      
      <h4>1. Gunakan Tas Belanja Kain</h4>
      <p>
        Salah satu cara paling mudah untuk mengurangi penggunaan plastik adalah dengan membawa tas belanja kain sendiri. Tas kain dapat digunakan berulang kali dan lebih ramah lingkungan dibandingkan kantong plastik sekali pakai.
      </p>

      <h4>2. Pilih Produk dengan Kemasan Ramah Lingkungan</h4>
      <p>
        Saat berbelanja, prioritaskan produk yang menggunakan kemasan kertas, kaca, atau kemasan yang dapat didaur ulang. Hindari produk dengan kemasan plastik berlebihan.
      </p>

      <h4>3. Gunakan Botol Minum Sendiri</h4>
      <p>
        Membawa botol minum sendiri dapat mengurangi penggunaan botol plastik sekali pakai secara signifikan. Pilih botol yang terbuat dari bahan stainless steel atau kaca untuk penggunaan jangka panjang.
      </p>

      <h4>4. Kompos Sampah Organik</h4>
      <p>
        Dengan mengkompos sampah organik, kita dapat mengurangi volume sampah yang dibuang ke tempat pembuangan akhir. Selain itu, kompos yang dihasilkan dapat digunakan sebagai pupuk alami untuk tanaman.
      </p>

      <h4>5. Repair, Don't Replace</h4>
      <p>
        Sebelum membuang barang yang rusak, cobalah untuk memperbaikinya terlebih dahulu. Ini tidak hanya mengurangi sampah, tetapi juga menghemat uang dan sumber daya.
      </p>

      <p>
        Dengan menerapkan tips-tips di atas secara konsisten, kita dapat berkontribusi dalam mengurangi pencemaran plastik dan menjaga kelestarian lingkungan untuk generasi mendatang.
      </p>
    </article>
  );
};

export default ArticleDetailContent;