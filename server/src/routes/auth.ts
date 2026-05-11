import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes'
      }
    }
  }, async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return reply.status(401).send({ error: 'Nieprawidłowy email lub hasło' });
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
      return reply.status(401).send({ error: 'Nieprawidłowy email lub hasło' });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { user: { name: user.name, role: user.role } };
  });
}
