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
  logger: true // Wymuszamy logowanie wszystkiego
}).withTypeProvider<ZodTypeProvider>();

// Konfiguracja Zod
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(helmet);

// Bezpieczeństwo JWT z twardym sprawdzeniem
if (!process.env.JWT_SECRET) {
  console.error("❌ BŁĄD KRYTYCZNY: BRAK JWT_SECRET!");
  process.exit(1);
}

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: { cookieName: 'accessToken', signed: false }
});

fastify.register(cookie);
fastify.register(rateLimit, { global: true, max: 100, timeWindow: '1 minute' });

// Wymuszony CORS otwarty na oścież dla produkcji
fastify.register(cors, {
  origin: true, 
  credentials: true
});

// Uproszczony Error Handler, żeby na pewno sam nie powodował błędów
fastify.setErrorHandler((error, request, reply) => {
  console.error("❌ Złapano błąd:", error);
  return reply.status(500).send({ error: 'Wystąpił błąd serwera', details: error.message });
});

// BARDZO WAŻNE: Ścieżka zdrowia (Healthcheck) dla Coolify
fastify.get('/', async () => {
  return { status: 'OK', message: 'Backend żyje i ma się dobrze!' };
});

// Rejestracja ruterów
fastify.register(bookingRoutes);
fastify.register(authRoutes);
fastify.register(adminRoutes);

const start = async () => {
  try {
    console.log("=== PRÓBA URUCHOMIENIA NASŁUCHIWANIA ===");
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
    console.log(`Zatrzymywanie serwera z powodu ${signal}`);
    await fastify.close();
    await prisma.$disconnect();
    process.exit(0);
  });
});

start();
