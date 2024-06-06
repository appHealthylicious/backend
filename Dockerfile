# Node.js image sebagai base image
FROM node:18

# Workdirectory
WORKDIR /usr/src/app

# Salin file package.json
COPY package*.json ./

# Instal dependensi aplikasi
RUN npm install

# Salin seluruh kode aplikasi
COPY . .

# Ekspose port yang digunakan oleh aplikasi
EXPOSE 8080

# Set environment variables
ENV PORT 8080

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/server.js"]
