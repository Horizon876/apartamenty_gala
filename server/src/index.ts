import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import { serializerCompiler, validatorCompiler, ZodTypeProvider, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
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
}).withTypeProvider<ZodTypeProvider>();

// Konfiguracja Zod w Fastify
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

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
  global: true,
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

// Globalny Error Handler ustandaryzowany dla Zoda i Prismy
fastify.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      error: 'Błąd walidacji danych',
      details: error.validation
    });
  }
  
  if (error.message === 'Brak dostępnych pokoi tego typu w wybranym terminie' || 
      error.message === 'Liczba gości przekracza pojemność pokoju') {
    return reply.status(409).send({ error: error.message });
  }

  if (error.code && error.code.startsWith('P2')) {
    return reply.status(400).send({ error: 'Błąd bazy danych (np. konflikt danych)' });
  }

  if (error.statusCode === 429) {
    return reply.status(429).send({ error: 'Zbyt wiele żądań, spróbuj ponownie później.' });
  }

  request.log.error(error);
  return reply.status(500).send({ error: 'Wystąpił nieoczekiwany błąd serwera' });
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
