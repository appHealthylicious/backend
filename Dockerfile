# Gunakan Node.js image sebagai base image
FROM node:18

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set Python 3
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set Virtual env
RUN python -m venv /opt/venv

# Install Python dependencies
COPY requirements.txt .
RUN /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Download the spaCy model
RUN /opt/venv/bin/python -m spacy download en_core_web_sm

# Install Node.js dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Copy Application Code
COPY . .

# Pyton script dalam Virtual env
ENV PATH="/opt/venv/bin:$PATH"

# Salin file firebase-service-account.json ke dalam container
COPY firebase-service-account.json ./src/utils/firebase-service-account.json

# Ekspose port yang digunakan oleh aplikasi
EXPOSE 8080

# Set environment variables
ENV PORT 8080

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/server.js"]
