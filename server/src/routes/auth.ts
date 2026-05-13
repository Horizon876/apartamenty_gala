import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import prisma from '../lib/db';

const loginSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});

export async function authRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post('/auth/login', {
    schema: {
      body: loginSchema,
    },
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute'
      }
    }
  }, async (request, reply) => {
    const body = request.body;

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    // Dummy hash: wynik bcrypt.hashSync('dummy_password', 10)
    // Zapewnia to, że bcrypt zużyje tyle samo czasu, co przy weryfikacji prawdziwego hasła.
    const dummyHash = '$2b$10$qi0Zr92opRa27rn8xBtVqON/uO3PU6FilGYH5.yiZMlQ9X99.hVTS';
    const hashToCompare = user ? user.password : dummyHash;

    const isValid = await bcrypt.compare(body.password, hashToCompare);

    if (!user || !isValid) {
      return reply.status(401).send({ error: 'Nieprawidłowy email lub hasło' });
    }

    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    } as any, { expiresIn: '15m' }); // Krótki czas życia tokena dostępu

    const refreshToken = fastify.jwt.sign({
      id: user.id,
    } as any, { expiresIn: '7d' }); // Dłuższy czas życia tokena odświeżania

    reply.setCookie('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    reply.setCookie('refreshToken', refreshToken, {
      path: '/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { user: { name: user.name, role: user.role } };
  });

  server.post('/auth/refresh', async (request, reply) => {
    const token = request.cookies.refreshToken;
    if (!token) {
      return reply.status(401).send({ error: 'Brak tokenu odświeżania' });
    }

    try {
      const decoded = fastify.jwt.verify<{ id: string }>(token);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) {
        return reply.status(401).send({ error: 'Nieprawidłowy token' });
      }

      const newAccessToken = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      } as any, { expiresIn: '15m' });

      reply.setCookie('accessToken', newAccessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return { success: true };
    } catch (err) {
      return reply.status(401).send({ error: 'Nieprawidłowy lub wygasły token odświeżania' });
    }
  });
}
