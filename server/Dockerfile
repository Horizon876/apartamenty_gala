# ETAP 1: Budowanie backendu
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# ETAP 2: Środowisko produkcyjne
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
# Instalacja paczek produkcyjnych
RUN npm install --omit=dev

# Przekopiowanie zbudowanych plików oraz Prisma z etapu 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Kopiowanie skryptu uruchomieniowego (opcjonalnie startujemy przez node)
EXPOSE 3000

# Push schematu bazy danych (SQLite dla wariantu prostego, Postgres dla zaawansowanego) i start
CMD npx prisma db push && npm run start
