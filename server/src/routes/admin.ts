import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import prisma from '../lib/db';

const roomTypeSchema = z.object({
  name: z.string().max(100),
  capacity: z.coerce.number().int().positive(),
  totalRooms: z.coerce.number().int().positive(),
  description: z.string().max(2000).optional(),
  basePrice: z.coerce.number().positive(),
  images: z.union([z.string(), z.array(z.string())]).optional().transform(val => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return [val];
    return [];
  })
});

const statusSchema = z.object({
  status: z.enum(['PENDING', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'])
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50)
});

export async function adminRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  // Middleware do sprawdzania tokena
  server.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
      const role = (request.user as any).role;
      if (role !== 'ADMIN' && role !== 'RECEPTIONIST') {
        return reply.status(403).send({ error: 'Brak uprawnień' });
      }
    } catch (err) {
      reply.status(401).send({ error: 'Nieautoryzowany' });
    }
  });

  server.delete<{ Params: { id: string } }>('/admin/bookings/:id', async (request, reply) => {
    const { id } = request.params;
    await prisma.booking.delete({
      where: { id }
    });
    return { success: true };
  });

  server.get('/admin/bookings', {
    schema: { querystring: paginationSchema }
  }, async (request, reply) => {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;

    const bookings = await prisma.booking.findMany({
      skip,
      take: limit,
      include: {
        roomType: true,
      },
      orderBy: {
        checkIn: 'asc',
      },
    });
    
    const total = await prisma.booking.count();
    return { data: bookings, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  });

  server.get('/admin/room-types', {
    schema: { querystring: paginationSchema }
  }, async (request, reply) => {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;

    const roomTypes = await prisma.roomType.findMany({
      skip,
      take: limit,
    });
    
    const total = await prisma.roomType.count();
    return { data: roomTypes, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  });

  server.post('/admin/room-types', {
    schema: { body: roomTypeSchema }
  }, async (request, reply) => {
    const { name, capacity, totalRooms, description, basePrice, images } = request.body;
    const roomType = await prisma.roomType.create({
      data: {
        name,
        capacity,
        totalRooms,
        description,
        basePrice,
        images
      }
    });
    return roomType;
  });

  server.put<{ Params: { id: string } }>('/admin/room-types/:id', {
    schema: { body: roomTypeSchema }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, capacity, totalRooms, description, basePrice, images } = request.body;
    const roomType = await prisma.roomType.update({
      where: { id },
      data: {
        name,
        capacity,
        totalRooms,
        description,
        basePrice,
        images
      }
    });
    return roomType;
  });

  server.delete<{ Params: { id: string } }>('/admin/room-types/:id', async (request, reply) => {
    const { id } = request.params;
    await prisma.roomType.delete({
      where: { id }
    });
    return { success: true };
  });

  server.get('/admin/stats', async (request, reply) => {
    const totalBookings = await prisma.booking.count();
    const roomsAggr = await prisma.roomType.aggregate({
      _sum: { totalRooms: true }
    });
    
    return {
      totalBookings,
      totalRooms: roomsAggr._sum.totalRooms || 0,
    };
  });

  server.patch<{ Params: { id: string } }>('/admin/bookings/:id/status', {
    schema: { body: statusSchema }
  }, async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body;
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { roomType: true }
    });
    return booking;
  });
}
