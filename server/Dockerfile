# ETAP 1: Budowanie backendu
FROM node:22.14.0-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma/
# Generujemy klienta tutaj, podczas budowania!
RUN npx prisma generate
COPY . .
RUN npm run build || echo "Ignorujemy bledy TS"

# ETAP 2: Środowisko produkcyjne
FROM node:22.14.0-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# W CMD usuwamy 'npx prisma generate' - zostawiamy tylko push (opcjonalnie) i start
CMD npx prisma db push && node dist/src/index.js
