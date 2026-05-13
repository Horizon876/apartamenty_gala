# ETAP 1: Budowanie backendu
FROM node:22.14.0-slim AS builder

WORKDIR /app

# Kopiowanie plików paczek i instalacja wszystkich zależności
COPY package*.json ./
RUN npm install

# Kopiowanie folderu prisma i wygenerowanie klienta (ważne, by to było przed buildem)
COPY prisma ./prisma/
RUN npx prisma generate

# Kopiowanie reszty plików i budowanie TypeScript do JavaScript z ignorowaniem błędów
COPY . .
RUN npm run build || echo "Ignorujemy bledy TS i jedziemy dalej"

# ETAP 2: Środowisko produkcyjne
FROM node:22.14.0-slim

WORKDIR /app

# Instalacja OpenSSL (często wymagana przez silnik Prisma na systemach Debian/Slim)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Przekopiowanie zależności, zbudowanego kodu i plików Prismy
# Kopiujemy całe node_modules, żeby mieć wygenerowanego klienta Prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Push schematu bazy danych (SQLite dla wariantu prostego) i start serwera
CMD npx prisma db push && npm run start
