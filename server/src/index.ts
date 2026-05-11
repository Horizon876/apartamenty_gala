import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import { bookingRoutes } from './routes/bookings';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';

const prisma = new PrismaClient();

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development' ? {
    transport: {
      target: 'pino-pretty'
    }
  } : true,
});

fastify.register(helmet);

// Rejestracja JWT
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}
fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false
  }
});

fastify.register(cookie);
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Rejestracja CORS
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Rejestracja ruterów
fastify.register(bookingRoutes);
fastify.register(authRoutes);
fastify.register(adminRoutes);

// Uruchomienie serwera
const start = async () => {
  try {
    const PORT = 3000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Zatrzymywanie serwera z powodu ${signal}`);
    await fastify.close();
    await prisma.$disconnect();
    process.exit(0);
  });
});

start();
