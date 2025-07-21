Backend API - Harmoni Alam
Backend API untuk platform Harmoni Alam, sebuah aplikasi yang dirancang untuk menghubungkan sukarelawan (volunteer) dengan penyelenggara acara (organizer) kegiatan sosial dan lingkungan.

API ini dibangun dengan arsitektur yang bersih dan skalabel, memisahkan logika berdasarkan peran pengguna untuk memastikan keamanan dan kemudahan pengelolaan.

✨ Fitur Utama
Sistem Multi-Peran: Otentikasi dan otorisasi yang terpisah untuk tiga jenis pengguna: Volunteer, Organizer, dan Admin.

Alur Registrasi Terpisah: Proses pendaftaran yang berbeda untuk Volunteer dan Organizer, memungkinkan pengumpulan data yang relevan untuk setiap peran.

Verifikasi Organizer: Sistem di mana pendaftaran Organizer harus diverifikasi dan disetujui oleh Admin sebelum akun dapat aktif sepenuhnya.

Manajemen Konten: Kemampuan bagi pengguna yang berwenang (Volunteer, Organizer, Admin) untuk membuat dan mengelola artikel.

Manajemen Event: Fungsionalitas penuh bagi Organizer untuk membuat, mengelola, dan melihat partisipan pada event mereka.

Sistem Partisipasi: Alur bagi Volunteer untuk mendaftar dan membatalkan pendaftaran pada event yang tersedia.

Keamanan: Penggunaan JSON Web Tokens (JWT) untuk melindungi endpoint dan memastikan bahwa hanya pengguna yang tepat yang dapat mengakses sumber daya tertentu.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL

ORM: Prisma

Otentikasi: JSON Web Token (JWT)

Password Hashing: Bcrypt

Environment Variables: Dotenv

📖 Dokumentasi API
Dokumentasi lengkap mengenai setiap endpoint, termasuk contoh request dan response, tersedia di Postman.

Lihat Dokumentasi API Lengkap di Postman

🚀 Instalasi & Menjalankan Proyek
Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

Clone repositori ini

Bash

git clone [URL_REPOSITORY_ANDA]
cd [NAMA_FOLDER_PROYEK]
Install semua dependency

Bash

npm install
Siapkan Environment Variables

Buat file baru bernama .env di root proyek.

Salin isi dari file .env.example (jika ada) atau gunakan template di bawah ini dan sesuaikan dengan konfigurasi database Anda.

Cuplikan kode

# Ganti dengan URL koneksi database PostgreSQL Anda
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Port untuk menjalankan server
PORT=3000

# Kunci rahasia untuk menandatangani JWT (ganti dengan string acak yang kuat)
JWT_SECRET="GANTI_DENGAN_KUNCI_RAHASIA_YANG_SANGAT_ACAK"
Jalankan Migrasi Database

Perintah ini akan membuat semua tabel di database Anda sesuai dengan skema Prisma.

Bash

npx prisma migrate dev
Jalankan Server

Server akan berjalan dalam mode development dengan auto-reload menggunakan nodemon.

Bash

npm run dev
API Anda sekarang berjalan di http://localhost:3000.