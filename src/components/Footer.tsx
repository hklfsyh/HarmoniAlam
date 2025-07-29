// src/components/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A3A53] text-gray-300">
      <div className="container mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-normal text-white">
              Harmoni<span className="text-[#79B829] font-normal">Alam</span>
            </h3>
            <p className="mt-4 text-gray-400 leading-relaxed font-light">
              Menghubungkan komunitas untuk aksi lingkungan di seluruh dunia. Bergabunglah dengan kami dalam membangun masa depan berkelanjutan melalui inisiatif lokal dan dampak global.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-normal text-white mb-4">Tautan Cepat</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-[#79B829] transition-colors font-light">Beranda</Link></li>
              <li><Link to="/event" className="hover:text-[#79B829] transition-colors font-light">Event</Link></li>
              <li><Link to="/artikel" className="hover:text-[#79B829] transition-colors font-light">Artikel</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-normal text-white mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-gray-400 font-light">
              <li>info@harmonialam.org</li>
              <li>0867687368734</li>
              <li>123 Jalan Hijau, Kota Eco</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Facebook" className="text-white hover:text-[#79B829] transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-white hover:text-[#79B829] transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center sm:text-left font-light">
            © 2025 HarmoniAlam.org - <span className="text-[#79B829] font-light">Membangun masa depan berkelanjutan bersama</span>
          </p>
          <div className="flex gap-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Kebijakan Privasi</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Ketentuan Layanan</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Kebijakan Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;