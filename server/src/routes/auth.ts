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

    // Dummy hash (bcrypt.hashSync('dummy', 10)) aby zapobiec atakom timing (User Enumeration)
    const dummyHash = '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const hashToCompare = user ? user.password : dummyHash;

    const isValid = await bcrypt.compare(body.password, hashToCompare);

    if (!user || !isValid) {
      return reply.status(401).send({ error: 'Nieprawidłowy email lub hasło' });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }, { expiresIn: '12h' }); // Token expires in 12 hours

    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { user: { name: user.name, role: user.role } };
  });
}
