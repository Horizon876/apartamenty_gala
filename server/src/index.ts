import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { bookingRoutes } from './routes/bookings';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';

const fastify = Fastify({
  logger: true,
});

// Rejestracja JWT
fastify.register(jwt, {
  secret: 'super-tajne-haslo-gala-2026', // W produkcji użyj zmiennej środowiskowej
});

// Rejestracja CORS
fastify.register(cors, {
  origin: true,
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

start();
