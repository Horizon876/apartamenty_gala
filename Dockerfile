# ETAP 1: Budowanie aplikacji Frontend
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ETAP 2: Serwowanie z Nginx
FROM nginx:alpine

# Kopiowanie skompilowanych plików frontendu z poprzedniego etapu
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopiowanie niestandardowej konfiguracji Nginx (obsługa React Routera)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
