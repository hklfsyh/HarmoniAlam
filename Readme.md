<div align="center">

![Harmoni Alam Logo](https://storage.googleapis.com/harmoni_alam/Logo_HarmoniAlam.png)

# 🌿 Harmoni Alam Backend API

### *Menghubungkan Relawan dengan Aksi Lingkungan di Seluruh Indonesia*

[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)


---

*Backend API untuk platform revolusioner yang menghubungkan sukarelawan dengan penyelenggara acara kegiatan sosial dan lingkungan. Dibangun dengan arsitektur modern, skalabel, dan aman.*

</div>

---

## 🎯 **Tentang Proyek**

Harmoni Alam adalah platform digital yang memfasilitasi kolaborasi antara volunteer dan organizer dalam kegiatan pelestarian lingkungan. API ini dirancang dengan pendekatan **clean architecture** dan **role-based access control** untuk memastikan keamanan dan skalabilitas maksimal.

<div align="center">

```mermaid
graph LR
    A[🙋‍♂️ Volunteer] --> B[🌱 Platform]
    C[🏢 Organizer] --> B
    D[👨‍💼 Admin] --> B
    B --> E[🌍 Aksi Lingkungan]
    
    style B fill:#4ade80,stroke:#16a34a,stroke-width:3px
    style E fill:#34d399,stroke:#10b981,stroke-width:2px
```

</div>

---

## ✨ **Fitur Unggulan**

<table>
<tr>
<td width="33%" align="center">

### 🔐 **Multi-Role Security**
Sistem otentikasi berlapis dengan JWT untuk Volunteer, Organizer, dan Admin

</td>
<td width="33%" align="center">

### 📧 **Smart Verification**
Alur verifikasi email otomatis dengan approval manual untuk Organizer

</td>
<td width="33%" align="center">

### 📝 **Dynamic Content**
Manajemen artikel dan event dengan status Draft/Publish dan galeri foto

</td>
</tr>
<tr>
<td width="33%" align="center">

### 🎯 **Event Management**
Platform komprehensif untuk membuat dan mengelola event lingkungan

</td>
<td width="33%" align="center">

### 🔖 **Interactive Features**
Sistem bookmark dan registrasi event yang responsif

</td>
<td width="33%" align="center">

### ☁️ **Cloud Integration**
Penyimpanan file aman dengan Google Cloud Storage

</td>
</tr>
</table>

---

## 🛠️ **Tech Stack**

<div align="center">

| **Kategori** | **Teknologi** | **Deskripsi** |
|:---:|:---:|:---|
| 🖥️ **Runtime** | Node.js | JavaScript runtime environment |
| 🚀 **Framework** | Express.js | Fast, unopinionated web framework |
| 🗄️ **Database** | PostgreSQL + Supabase | Managed PostgreSQL database |
| 🔧 **ORM** | Prisma | Next-generation ORM for Node.js |
| 🔒 **Auth** | JWT + Bcrypt | Secure authentication & hashing |
| 📧 **Email** | Nodemailer | Email delivery service |
| ☁️ **Storage** | Google Cloud Storage | Scalable object storage |
| 🚀 **Deploy** | Google Cloud Run | Serverless container platform |

</div>

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 atau lebih tinggi)
- PostgreSQL database (atau akun Supabase)
- Google Cloud Platform account
- Gmail account untuk email service

### **Installation**

```bash
# 1️⃣ Clone repository
git clone https://github.com/hklfsyh/HarmoniAlam.git
cd HarmoniAlam

# 2️⃣ Install dependencies
npm install

# 3️⃣ Setup environment variables
cp .env.example .env
# Edit .env file dengan konfigurasi Anda

# 4️⃣ Run database migrations
npx prisma migrate dev

# 5️⃣ Start development server
npm run dev
```

<div align="center">

🎉 **API berhasil berjalan di** `http://localhost:3000`

</div>

---

## ⚙️ **Environment Setup**

Buat file `.env` di root directory dengan konfigurasi berikut:

```env
# 🗄️ Database Configuration
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# 🌐 Server Configuration
PORT=3000
FRONTEND_URL="http://localhost:5173"

# 🔐 Security
JWT_SECRET="your-super-secret-jwt-key-here"

# ☁️ Google Cloud Storage
GCS_PROJECT_ID="your-gcp-project-id"
GCS_BUCKET_NAME="your-gcs-bucket-name"
GCS_KEYFILE_PATH="./gcs-credentials.json"

# 📧 Email Service
GMAIL_USER="your-app-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-digit-app-password"
ADMIN_EMAIL_RECIPIENT="admin@yourcompany.com"
```

---

## 🏗️ **Architecture Overview**

<div align="center">

```mermaid
graph TB
    subgraph "👥 Users"
        U1[🙋‍♂️ Volunteer]
        U2[🏢 Organizer]
        U3[👨‍💼 Admin]
    end
    
    subgraph "🖥️ Backend API"
        A[🚀 Express Routes]
        B[🛡️ Auth Middleware]
        C[🎯 Controllers]
        D[🔧 Prisma ORM]
    end
    
    subgraph "☁️ External Services"
        E[📊 Supabase DB]
        F[💾 Google Cloud Storage]
        G[📧 Email Service]
    end
    
    U1 --> A
    U2 --> A
    U3 --> A
    A --> B
    B --> C
    C --> D
    C --> F
    C --> G
    D --> E
    
    classDef users fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    classDef backend fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    classDef external fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    
    class U1,U2,U3 users
    class A,B,C,D backend
    class E,F,G external
```

</div>

### **📁 Project Structure**

```
HarmoniAlam/
├── 📁 config/          # Database & service configurations
├── 📁 controllers/     # Business logic handlers
├── 📁 middleware/      # Authentication & validation
├── 📁 routes/          # API endpoint definitions
├── 📁 utils/           # Helper functions
├── 📁 prisma/          # Database schema & migrations
├── 📄 server.js        # Application entry point
└── 📄 .env             # Environment variables
```

---

## 🧪 **API Testing**

Test semua endpoint menggunakan Postman collection yang telah disiapkan:

<div align="center">

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/36349178/2sB34kEz5n)

</div>

### **🔑 Authentication Flow**

1. **Register** → Pilih role (Volunteer/Organizer)
2. **Email Verification** → Klik link di email
3. **Login** → Dapatkan JWT token
4. **Access Protected Routes** → Gunakan `Bearer <token>`

### **📋 Testing Checklist**

- [ ] User registration & verification
- [ ] JWT authentication
- [ ] Role-based access control
- [ ] CRUD operations for events & articles
- [ ] File upload functionality
- [ ] Email notifications

---

## 🌐 **Deployment**

### **☁️ Google Cloud Run Deployment**

```bash
# 1️⃣ Build and deploy
gcloud run deploy --source .

# 2️⃣ Update database schema
npx prisma migrate deploy

# 3️⃣ Configure environment variables in Cloud Console
```

### **🔧 Production Checklist**

- [ ] Environment variables configured in Secret Manager
- [ ] Database migrations applied
- [ ] Cloud Storage bucket permissions set
- [ ] Domain & SSL certificates configured
- [ ] Monitoring & logging enabled

---

## 📊 **Database Schema**

<div align="center">

```mermaid
erDiagram
    VOLUNTEER ||--o{ AUTHOR : creates
    ORGANIZER ||--o{ AUTHOR : creates
    ADMIN ||--o{ AUTHOR : creates
    
    AUTHOR ||--o{ ARTICLE : writes
    ORGANIZER ||--o{ EVENT : organizes
    
    VOLUNTEER ||--o{ EVENT_REGISTRATION : registers
    EVENT ||--o{ EVENT_REGISTRATION : has
    
    VOLUNTEER ||--o{ BOOKMARK : saves
    ARTICLE ||--o{ BOOKMARK : bookmarked
    EVENT ||--o{ BOOKMARK : bookmarked
    
    ARTICLE ||--o{ IMAGE : contains
    EVENT ||--o{ IMAGE : contains
```

</div>

---


<div align="center">

### 🌱 **Dibuat dengan ❤️ untuk lingkungan yang lebih baik**

*"Setiap aksi kecil untuk lingkungan adalah langkah besar untuk masa depan"*

---

