# Backend API - Harmoni Alam

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white)

Backend API untuk platform **Harmoni Alam**, sebuah aplikasi yang dirancang untuk menghubungkan sukarelawan (volunteer) dengan penyelenggara acara (organizer) kegiatan sosial dan lingkungan.

API ini dibangun dengan arsitektur yang bersih dan skalabel, memisahkan logika berdasarkan peran pengguna untuk memastikan keamanan dan kemudahan pengelolaan.

---
## ✨ Fitur Utama

* **Sistem Multi-Peran**: Otentikasi dan otorisasi yang terpisah untuk tiga jenis pengguna: **Volunteer**, **Organizer**, dan **Admin**.
* **Alur Registrasi Terpisah**: Proses pendaftaran yang berbeda untuk Volunteer dan Organizer, memungkinkan pengumpulan data yang relevan untuk setiap peran.
* **Verifikasi Organizer**: Sistem di mana pendaftaran Organizer harus diverifikasi dan disetujui oleh Admin sebelum akun dapat aktif sepenuhnya.
* **Manajemen Konten**: Kemampuan bagi pengguna yang berwenang (Volunteer, Organizer, Admin) untuk membuat dan mengelola artikel.
* **Manajemen Event**: Fungsionalitas penuh bagi Organizer untuk membuat, mengelola, dan melihat partisipan pada event mereka.
* **Sistem Partisipasi**: Alur bagi Volunteer untuk mendaftar dan membatalkan pendaftaran pada event yang tersedia.
* **Keamanan**: Penggunaan JSON Web Tokens (JWT) untuk melindungi endpoint dan memastikan bahwa hanya pengguna yang tepat yang dapat mengakses sumber daya tertentu.

---
## 🛠️ Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Otentikasi**: JSON Web Token (JWT)
* **Password Hashing**: Bcrypt
* **Environment Variables**: Dotenv

---
## 📖 Dokumentasi API

Dokumentasi lengkap mengenai setiap endpoint, termasuk contoh request dan response, tersedia di Postman.

**[Lihat Dokumentasi API Lengkap di Postman](https://documenter.getpostman.com/view/36349178/2sB34kEz5n)**

---
## 🚀 Instalasi & Menjalankan Proyek

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone repositori ini**
    ```bash
    git clone [URL_REPOSITORY_ANDA]
    cd [NAMA_FOLDER_PROYEK]
    ```

2.  **Install semua dependency**
    ```bash
    npm install
    ```

3.  **Siapkan Environment Variables**
    * Buat file baru bernama `.env` di root proyek.
    * Salin isi dari file `.env.example` (jika ada) atau gunakan template di bawah ini dan sesuaikan dengan konfigurasi database Anda.

    ```env
    # Ganti dengan URL koneksi database PostgreSQL Anda
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

    # Port untuk menjalankan server
    PORT=3000

    # Kunci rahasia untuk menandatangani JWT (ganti dengan string acak yang kuat)
    JWT_SECRET="GANTI_DENGAN_KUNCI_RAHASIA_YANG_SANGAT_ACAK"
    ```

4.  **Jalankan Migrasi Database**
    * Perintah ini akan membuat semua tabel di database Anda sesuai dengan skema Prisma.
    ```bash
    npx prisma migrate dev
    ```

5.  **Jalankan Server**
    * Server akan berjalan dalam mode development dengan auto-reload menggunakan nodemon.
    ```bash
    npm run dev
    ```
    API Anda sekarang berjalan di `http://localhost:3000`.