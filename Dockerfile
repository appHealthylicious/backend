# Gunakan Node.js image sebagai base image
FROM node:18

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi aplikasi
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Salin file firebase-service-account.json ke dalam container
COPY firebase-service-account.json ./src/utils/firebase-service-account.json

# Ekspose port yang digunakan oleh aplikasi
EXPOSE 8080

# Set environment variables
ENV PORT 8080

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/server.js"]
