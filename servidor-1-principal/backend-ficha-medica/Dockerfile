FROM node:20-slim

WORKDIR /app

# Instalar OpenSSL (requerido por Prisma en Debian slim)
RUN apt-get update -y && apt-get install -y openssl

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar resto del código
COPY . .

# Generar Prisma Client
RUN npx prisma generate

EXPOSE 3002

CMD ["npm", "start"]
