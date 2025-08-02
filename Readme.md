<div align="center">
<!-- Ganti URL ini dengan URL logo Anda yang sudah diunggah -->
<img src="https://storage.googleapis.com/harmoni_alam/assets/logo-harmoni-alam.png" alt="Harmoni Alam Logo" width="150">
<h1>Backend API - Harmoni Alam</h1>
<p><strong>Menghubungkan Relawan dengan Aksi Lingkungan di Seluruh Indonesia</strong></p>
</div>

<p align="center">
<img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white">
<img alt="Node.js" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
<img alt="PostgreSQL" src="https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white">
<img alt="Google Cloud" src="https://img.shields.io/badge/Google%20Cloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white">
<img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
<img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white">
</p>

Backend API untuk platform Harmoni Alam, sebuah aplikasi yang dirancang untuk menghubungkan sukarelawan (volunteer) dengan penyelenggara acara (organizer) kegiatan sosial dan lingkungan. API ini dibangun dengan arsitektur yang bersih dan skalabel, memisahkan logika berdasarkan peran pengguna untuk memastikan keamanan dan kemudahan pengelolaan.

✨ Fitur Utama
Sistem Multi-Peran: Otentikasi dan otorisasi yang terpisah untuk tiga jenis pengguna: Volunteer, Organizer, dan Admin, masing-masing dengan hak akses yang terdefinisi dengan jelas.

Alur Registrasi dan Verifikasi: Proses pendaftaran yang aman untuk Volunteer dan Organizer, dilengkapi dengan verifikasi email wajib untuk memastikan validitas akun.

Verifikasi Organizer Berlapis: Sistem di mana pendaftaran Organizer harus melalui verifikasi email, kemudian ditinjau dan disetujui secara manual oleh Admin, termasuk pemeriksaan dokumen pendukung. Organizer yang ditolak dapat mengajukan ulang setelah memperbaiki data.

Manajemen Konten Dinamis: Kemampuan bagi pengguna yang berwenang (Volunteer, Organizer, Admin) untuk membuat dan mengelola artikel dengan sistem status Draft & Publish serta dukungan galeri foto.

Manajemen Event Komprehensif: Fungsionalitas penuh bagi Organizer untuk membuat, mengelola, dan melihat partisipan pada event mereka, lengkap dengan detail lokasi berbasis koordinat dan galeri foto.

Sistem Partisipasi Interaktif: Alur bagi Volunteer untuk mendaftar dan membatalkan pendaftaran pada event, serta fitur Bookmark untuk menyimpan artikel dan event yang menarik.

Keamanan dan Moderasi: Penggunaan JSON Web Tokens (JWT) untuk melindungi endpoint. Admin memiliki kemampuan untuk melakukan soft delete pada konten atau akun pengguna yang melanggar aturan.

Penyimpanan File Cloud: Integrasi dengan Google Cloud Storage untuk mengunggah dan menyimpan gambar serta dokumen secara aman dalam folder yang terstruktur secara dinamis.

Sistem Notifikasi Email: Komunikasi otomatis melalui email untuk verifikasi akun, notifikasi persetujuan/penolakan, pengingat event, pembatalan, dan komunikasi langsung antara pengguna dan admin.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL (di-host di Supabase)

ORM: Prisma

Otentikasi: JSON Web Token (JWT)

Password Hashing: Bcrypt

Pengiriman Email: Nodemailer

Penyimpanan File: Google Cloud Storage

Deployment: Google Cloud Run

Environment Variables: Dotenv

🚀 Instalasi & Menjalankan Proyek
Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1. Clone Repositori
git clone https://github.com/hklfsyh/HarmoniAlam.git
cd HarmoniAlam

2. Install Dependencies
npm install

3. Siapkan Environment Variables
Buat file baru bernama .env di root proyek. Salin dan sesuaikan template di bawah ini dengan konfigurasi Anda.

# URL Koneksi Database (Supabase Pooler direkomendasikan)
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Port untuk server lokal
PORT=3000

# Kunci rahasia untuk JWT (ganti dengan string acak yang kuat)
JWT_SECRET="GANTI_DENGAN_KUNCI_RAHASIA_YANG_SANGAT_ACAK"

# URL Frontend (untuk link di email)
FRONTEND_URL="http://localhost:5173"

# Konfigurasi Google Cloud Storage
GCS_PROJECT_ID="ID_PROYEK_GCP_ANDA"
GCS_BUCKET_NAME="NAMA_BUCKET_GCS_ANDA"
GCS_KEYFILE_PATH="./gcs-credentials.json"

# Kredensial Nodemailer (Gunakan App Password dari Google)
GMAIL_USER="email.aplikasi.anda@gmail.com"
GMAIL_APP_PASSWORD="password_16_digit_dari_google"

# Email Admin untuk Menerima Notifikasi
ADMIN_EMAIL_RECIPIENT="email.pribadi.admin@gmail.com"

4. Jalankan Migrasi Database
Perintah ini akan membuat semua tabel di database Anda sesuai dengan skema Prisma.

npx prisma migrate dev

5. Jalankan Server
Server akan berjalan dalam mode development dengan auto-reload menggunakan nodemon.

npm run dev

API Anda sekarang berjalan di http://localhost:3000.

🏛️ Arsitektur & Desain Database
Struktur backend ini dirancang dengan pemisahan tanggung jawab yang jelas untuk setiap komponen.

Struktur Folder: Kode diorganisir ke dalam folder config, controllers, middleware, routes, dan utils untuk menjaga kerapian.

Model Data Utama:

Volunteer, Organizer, Admin: Tiga entitas pengguna dipisahkan ke dalam tabel yang berbeda untuk isolasi data dan keamanan.

Author: Model perantara yang menghubungkan ketiga jenis pengguna ke model Article, memungkinkan siapa saja untuk menjadi penulis tanpa mengacaukan relasi.

Event & Article: Sumber daya utama yang dibuat oleh pengguna. Event hanya bisa dibuat oleh Organizer, sedangkan Artikel bisa dibuat oleh siapa saja.

EventRegistration: Tabel penghubung (join table) yang mencatat partisipasi seorang Volunteer dalam sebuah Event.

Bookmark: Tabel yang menyimpan event atau artikel yang disimpan oleh Volunteer.

Image: Tabel untuk menyimpan URL gambar galeri yang terhubung ke Event atau Artikel.

📊 Diagram Alur Kerja Backend
Diagram ini mengilustrasikan alur request dari pengguna hingga ke database dan layanan cloud lainnya.

graph TD
    %% Styling
    classDef user fill:#f9f,stroke:#333,stroke-width:2px;
    classDef backend fill:#dcfce7,stroke:#22c55e,stroke-width:2px;
    classDef external fill:#e0f2fe,stroke:#0ea5e9,stroke-width:2px;

    subgraph Pengguna
        A[<img src='https://www.gstatic.com/images/icons/material/system/2x/account_circle_black_48dp.png' width='30' /><br>Volunteer]
        B[<img src='https://www.gstatic.com/images/icons/material/system/2x/group_black_48dp.png' width='30' /><br>Organizer]
        C[<img src='https://www.gstatic.com/images/icons/material/system/2x/admin_panel_settings_black_48dp.png' width='30' /><br>Admin]
    end
    class A,B,C user;

    subgraph "Backend API (Cloud Run)"
        D[Express App <br> Routes]
        E[Middleware <br> Otentikasi & Otorisasi]
        F[Controllers <br> Logika Bisnis]
        G[Prisma Client <br> ORM]
    end
    class D,E,F,G backend;

    subgraph "Layanan Eksternal"
        H[(<img src='https://cdn.worldvectorlogo.com/logos/supabase-logo-icon.svg' width='25' /><br>Supabase DB)]
        I[(<img src='https://www.gstatic.com/images/branding/product/2x/cloud_storage_48dp.png' width='25' /><br>GCS Buckets)]
        J[(<img src='https://www.gstatic.com/images/icons/material/system/2x/mail_black_48dp.png' width='25' /><br>Nodemailer)]
    end
    class H,I,J external;

    A -- HTTP Request --> D
    B -- HTTP Request --> D
    C -- HTTP Request --> D
    
    D -- Meneruskan Request --> E
    E -- Jika valid --> F
    F -- Query Data --> G
    F -- Upload/Delete File --> I
    F -- Kirim Email --> J
    G -- Koneksi DB --> H

🧪 Pengujian API (Postman)
Seluruh fungsionalitas API dapat diuji menggunakan Postman.

Langkah Pengujian:
Jalankan Proyek: Pastikan server API berjalan secara lokal (npm run dev).

Gunakan Koleksi Postman: Dokumentasi lengkap dan koleksi siap pakai tersedia untuk diimpor ke Postman.

<a href="https://documenter.getpostman.com/view/36349178/2sB34kEz5n" target="_blank">
<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">
</a>

Alur Pengujian:

Gunakan endpoint registrasi dan login (/api/volunteer/login, /api/organizer/login, /api/admin/login) untuk mendapatkan Token JWT.

Untuk endpoint yang memerlukan otorisasi, buka tab Headers di Postman dan tambahkan:

Key: Authorization

Value: Bearer <TOKEN_JWT_ANDA>

Untuk request yang mengunggah file (seperti membuat artikel atau event), gunakan tab Body → form-data.

☁️ Alur Deployment
Aplikasi ini dirancang untuk di-deploy menggunakan arsitektur modern dan skalabel.

Infrastruktur:
Database: Dihosting di Supabase sebagai layanan PostgreSQL terkelola (managed database).

Aplikasi API: Dijalankan sebagai container di Google Cloud Run, sebuah platform serverless yang otomatis menskalakan instance berdasarkan traffic.

Proses Deployment:
Deployment API ini dilakukan dengan meng-container-isasi aplikasi menggunakan Docker dan menjalankannya di Google Cloud Run. Proses ini memanfaatkan beberapa layanan Google Cloud untuk memastikan deployment yang aman dan otomatis. Alur kerjanya adalah sebagai berikut: developer menjalankan perintah gcloud run deploy --source . atau gcloud builds submit dari terminal. Perintah ini akan mengunggah kode sumber ke Google Cloud Build.

Cloud Build kemudian akan membaca Dockerfile yang ada di root proyek untuk membangun sebuah container image. Image yang berhasil dibuat akan disimpan di Artifact Registry. Selanjutnya, Google Cloud Run akan menarik image terbaru tersebut dan men-deploy-nya sebagai revisi baru dari layanan. Saat container berjalan, semua variabel lingkungan yang sensitif seperti DATABASE_URL dan JWT_SECRET akan diinjeksi secara aman dari Google Secret Manager. Setelah layanan berhasil berjalan, developer harus menjalankan npx prisma migrate deploy secara manual untuk menyinkronkan skema database di Supabase dengan kode terbaru.

<div align="center">
<strong>Dibuat dengan ❤️ untuk lingkungan yang lebih baik</strong>
</div>