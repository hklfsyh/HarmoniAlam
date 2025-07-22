# Backend API - Harmoni Alam

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white) ![Google Cloud](https://img.shields.io/badge/Google%20Cloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

Backend API untuk platform **Harmoni Alam**, sebuah aplikasi yang dirancang untuk menghubungkan sukarelawan (volunteer) dengan penyelenggara acara (organizer) kegiatan sosial dan lingkungan.

API ini dibangun dengan arsitektur yang bersih dan skalabel, memisahkan logika berdasarkan peran pengguna untuk memastikan keamanan dan kemudahan pengelolaan.

---

## ✨ Fitur Utama

- **Sistem Multi-Peran**: Otentikasi dan otorisasi yang terpisah untuk tiga jenis pengguna: **Volunteer**, **Organizer**, dan **Admin**.
- **Alur Registrasi Terpisah**: Proses pendaftaran yang berbeda untuk Volunteer dan Organizer, memungkinkan pengumpulan data yang relevan untuk setiap peran.
- **Verifikasi Organizer**: Sistem di mana pendaftaran Organizer harus diverifikasi dan disetujui oleh Admin sebelum akun dapat aktif sepenuhnya.
- **Manajemen Konten**: Kemampuan bagi pengguna yang berwenang (Volunteer, Organizer, Admin) untuk membuat dan mengelola artikel.
- **Manajemen Event**: Fungsionalitas penuh bagi Organizer untuk membuat, mengelola, dan melihat partisipan pada event mereka.
- **Sistem Partisipasi**: Alur bagi Volunteer untuk mendaftar dan membatalkan pendaftaran pada event yang tersedia.
- **Keamanan**: Penggunaan JSON Web Tokens (JWT) untuk melindungi endpoint dan memastikan bahwa hanya pengguna yang tepat yang dapat mengakses sumber daya tertentu.
- **Penyimpanan File Cloud**: Integrasi dengan Google Cloud Storage untuk mengunggah dan menyimpan gambar serta dokumen secara aman.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (di-host di Supabase)
- **ORM**: Prisma
- **Otentikasi**: JSON Web Token (JWT)
- **Password Hashing**: Bcrypt
- **Penyimpanan File**: Google Cloud Storage
- **Deployment**: Google Cloud Run
- **Environment Variables**: Dotenv

---

## 🚀 Instalasi & Menjalankan Proyek

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

### 1. Clone repositori ini

```bash
git clone https://github.com/hklfsyh/HarmoniAlam.git
cd HarmoniAlam
```

### 2. Install semua dependency

```bash
npm install
```

### 3. Siapkan Environment Variables

Buat file baru bernama `.env` di root proyek. Salin isi dari file `.env.example` (jika ada) atau gunakan template di bawah ini dan sesuaikan dengan konfigurasi database Anda.

```env
# Ganti dengan URL koneksi database PostgreSQL Anda (lokal atau cloud)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Port untuk menjalankan server
PORT=3000

# Kunci rahasia untuk menandatangani JWT (ganti dengan string acak yang kuat)
JWT_SECRET="GANTI_DENGAN_KUNCI_RAHASIA_YANG_SANGAT_ACAK"

# Konfigurasi Google Cloud Storage
GCS_PROJECT_ID="ID_PROYEK_GCP_ANDA"
GCS_BUCKET_NAME="NAMA_BUCKET_GCS_ANDA"
GCS_KEYFILE_PATH="./gcs-credentials.json"
```

### 4. Jalankan Migrasi Database

Perintah ini akan membuat semua tabel di database Anda sesuai dengan skema Prisma.

```bash
npx prisma migrate dev
```

### 5. Jalankan Server

Server akan berjalan dalam mode development dengan auto-reload menggunakan nodemon.

```bash
npm run dev
```

API Anda sekarang berjalan di `http://localhost:3000`.

---

## 🏛️ Arsitektur & Desain Database

Struktur backend ini dirancang dengan pemisahan tanggung jawab yang jelas untuk setiap komponen.

- **Struktur Folder**: Kode diorganisir ke dalam folder `config`, `controllers`, `middleware`, `routes`, dan `utils` untuk menjaga kerapian.
- **Model Data Utama**:
  - **`Volunteer`**, **`Organizer`**, **`Admin`**: Tiga entitas pengguna dipisahkan ke dalam tabel yang berbeda untuk isolasi data dan keamanan.
  - **`Author`**: Model perantara yang menghubungkan ketiga jenis pengguna ke model `Article`, memungkinkan siapa saja untuk menjadi penulis tanpa mengacaukan relasi.
  - **`Event`** & **`Article`**: Sumber daya utama yang dibuat oleh pengguna. Event hanya bisa dibuat oleh Organizer, sedangkan Artikel bisa dibuat oleh siapa saja.
  - **`EventRegistration`**: Tabel penghubung (*join table*) yang mencatat partisipasi seorang `Volunteer` dalam sebuah `Event`.

---

## 📊 Diagram Alur Kerja Backend

Diagram ini mengilustrasikan alur request dari pengguna hingga ke database dan layanan cloud lainnya.

```mermaid
graph TD
    subgraph Pengguna
        A[Volunteer]
        B[Organizer]
        C[Admin]
    end

    subgraph "Backend API (Cloud Run)"
        D[Express App <br> Routes]
        E[Middleware <br> Otentikasi & Otorisasi]
        F[Controllers <br> Logika Bisnis]
        G[Prisma Client <br> ORM]
    end

    subgraph "Layanan Eksternal"
        H[(Supabase <br> PostgreSQL DB)]
        I[(Google Cloud Storage <br> Buckets)]
    end

    A -- HTTP Request --> D
    B -- HTTP Request --> D
    C -- HTTP Request --> D
    
    D -- Meneruskan Request --> E
    E -- Jika valid --> F
    F -- Query Data --> G
    F -- Upload/Delete File --> I
    G -- Koneksi DB --> H
```

---

## 🧪 Pengujian API (Postman)

Seluruh fungsionalitas API dapat diuji menggunakan Postman.

### Langkah Pengujian:

1. **Jalankan Proyek**: Pastikan server API berjalan secara lokal (`npm run dev`).

2. **Gunakan Koleksi Postman**: Dokumentasi lengkap dan koleksi siap pakai tersedia untuk diimpor ke Postman.
   
   📋 [**Lihat Dokumentasi API Lengkap di Postman**](https://documenter.getpostman.com/view/your-collection-id)

3. **Alur Pengujian**:
   - Gunakan endpoint registrasi dan login (`/api/volunteer/login`, `/api/organizer/login`, `/api/admin/login`) untuk mendapatkan Token JWT.
   - Untuk endpoint yang memerlukan otorisasi, buka tab **Headers** di Postman dan tambahkan:
     - **Key**: `Authorization`
     - **Value**: `Bearer <TOKEN_JWT_ANDA>`
   - Untuk request yang mengunggah file (seperti membuat artikel atau event), gunakan tab **Body → form-data**.

---

## ☁️ Alur Deployment

Aplikasi ini dirancang untuk di-deploy menggunakan arsitektur modern dan skalabel.

### Infrastruktur:

- **Database**: Dihosting di Supabase sebagai layanan PostgreSQL terkelola (managed database).
- **Aplikasi API**: Dijalankan sebagai container di Google Cloud Run, sebuah platform serverless yang otomatis menskalakan instance berdasarkan traffic.

### Proses Deployment:

1. **Dockerfile**: Resep untuk membangun aplikasi Node.js menjadi sebuah container image yang efisien.
2. **Google Cloud Build**: Layanan yang secara otomatis mengambil kode, menjalankan Dockerfile, dan membuat container image.
3. **Artifact Registry**: Tempat penyimpanan container image yang sudah di-build.
4. **Google Secret Manager**: Digunakan untuk menyimpan semua data sensitif (`DATABASE_URL`, `JWT_SECRET`) secara terenkripsi.
5. **Deploy Commands**: `gcloud run deploy` atau `gcloud builds submit` digunakan untuk mengotomatiskan seluruh proses ini.
6. **Database Migration**: Setelah deploy berhasil, `npx prisma migrate deploy` dijalankan untuk menerapkan skema database ke environment produksi.

---

<div align="center">
  <strong>Dibuat dengan ❤️ untuk lingkungan yang lebih baik</strong>
</div>