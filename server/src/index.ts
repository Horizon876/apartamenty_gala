import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

console.log("=== INICJALIZACJA SERWERA ===");

import { bookingRoutes } from './routes/bookings';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import prisma from './lib/db';

const fastify = Fastify({
  logger: true 
}).withTypeProvider<ZodTypeProvider>();

// Konfiguracja Zod
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Wyłączamy niektóre nagłówki helmet, które mogą blokować działanie na HTTP/sslip.io
fastify.register(helmet, {
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Bezpieczeństwo JWT
if (!process.env.JWT_SECRET) {
  console.error("❌ BŁĄD KRYTYCZNY: BRAK JWT_SECRET!");
  process.exit(1);
}

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: { 
    cookieName: 'accessToken', 
    signed: false 
  }
});

// KONFIGURACJA CIASTECZEK POD HTTP
fastify.register(cookie, {
  parseOptions: {
    path: '/',
    secure: false,   // Bardzo ważne dla HTTP (nie HTTPS)
    httpOnly: true,
    sameSite: 'lax'  // Pozwala na przesyłanie między subdomenami
  }
});

fastify.register(rateLimit, { global: true, max: 100, timeWindow: '1 minute' });

// CORS - Precyzyjnie pod Twój frontend
fastify.register(cors, {
  origin: "http://ni1b367d4m65frdl5c81447i.51.83.197.19.sslip.io",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true
});

// Error Handler
fastify.setErrorHandler((error, request, reply) => {
  console.error("❌ Złapano błąd:", error);
  return reply.status(500).send({ error: 'Wystąpił błąd serwera', details: error.message });
});

// Healthcheck dla Coolify
fastify.get('/', async () => {
  return { status: 'OK', message: 'Backend żyje!' };
});

// Rejestracja ruterów
fastify.register(bookingRoutes);
fastify.register(authRoutes);
fastify.register(adminRoutes);

const start = async () => {
  try {
    const PORT = parseInt(process.env.PORT || '3000');
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀🚀🚀 SERWER DZIAŁA NA PORCIE: ${PORT} 🚀🚀🚀`);
  } catch (err) {
    console.error("❌ FATALNY BŁĄD STARTU SERWERA:", err);
    process.exit(1);
  }
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    await prisma.$disconnect();
    process.exit(0);
  });
});

start();
