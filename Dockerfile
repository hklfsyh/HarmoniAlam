# --- Tahap 1: Build Dependencies ---
# Ganti dari alpine ke slim
FROM node:18-slim AS builder

# Atur direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json terlebih dahulu untuk caching
COPY package*.json ./

# Install semua dependencies
RUN npm install

# Salin sisa kode proyek
COPY . .

# Pastikan Prisma Client digenerasi saat proses build
RUN npx prisma generate

# --- Tahap 2: Final Image ---
# Ganti dari alpine ke slim
FROM node:18-slim

# Atur direktori kerja
WORKDIR /usr/src/app

# Salin hanya file dan folder yang diperlukan dari tahap 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/src/generated ./src/generated

# Salin file kunci Google Cloud Service dari lokal ke dalam container
COPY gcs-credentials.json ./gcs-credentials.json

# Beritahu container bahwa aplikasi akan berjalan di port 3000
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD [ "node", "src/index.js" ]