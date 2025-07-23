// src/components/DetailEventOrganizerComponents/OverviewTab.tsx
import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';

// ... (Komponen InfoItem dan InfoSection tetap sama)
const InfoItem: React.FC<{ icon: React.ReactElement; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="text-[#79B829] mt-1">{icon}</div>
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-semibold text-[#1A3A53]">{value}</p>
        </div>
    </div>
);

const InfoSection: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-[#1A3A53] mb-2">{label}</h3>
        <p className="text-gray-600 leading-relaxed">{children}</p>
    </div>
);


const OverviewTab: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-md space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Detail Event</h2>

            {/* --- GAMBAR DITAMBAHKAN DI SINI --- */}
            <img 
              src="/imageTemplateArticle.png" // Ganti dengan path gambar event yang sesuai
              alt="Visual Event"
              className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={<Calendar />} label="Tanggal" value="25 Juli 2024" />
                <InfoItem icon={<Clock />} label="Waktu" value="08:00 - 12:00" />
                <InfoItem icon={<MapPin />} label="Lokasi" value="Pantai Ancol, Jakarta" />
                <InfoItem icon={<Users />} label="Kapasitas" value="100 orang" />
                <InfoItem icon={<Tag />} label="Kategori Event" value="Pembersihan Pantai" />
            </div>
        </div>
        
        <hr/>

        <div className="space-y-6">
            <InfoSection label="Deskripsi Event">
                Bergabunglah dengan kami untuk aksi bersih sungai komunitas demi memulihkan sungai lokal dan meningkatkan kesadaran akan pentingnya menjaga kebersihan lingkungan.
            </InfoSection>

            <InfoSection label="Kebutuhan yang Harus Dibawa">
                Peserta diharapkan membawa botol minum sendiri, menggunakan pakaian yang nyaman untuk aktivitas luar ruangan, dan memakai topi untuk melindungi dari sinar matahari.
            </InfoSection>

            <InfoSection label="Kebutuhan yang Disediakan">
                Panitia akan menyediakan sarung tangan, kantong sampah, air minum isi ulang, dan makanan ringan untuk semua peserta yang terdaftar.
            </InfoSection>
        </div>
    </div>
);

export default OverviewTab;