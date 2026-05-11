import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const roomTypeSchema = z.object({
  name: z.string(),
  capacity: z.preprocess((val) => Number(val), z.number().int().positive()),
  totalRooms: z.preprocess((val) => Number(val), z.number().int().positive()),
  description: z.string().optional(),
  basePrice: z.preprocess((val) => Number(val), z.number().positive()),
  images: z.union([z.string(), z.array(z.string())]).optional()
});

const statusSchema = z.object({
  status: z.enum(['PENDING', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'])
});

export async function adminRoutes(fastify: FastifyInstance) {
  // Middleware do sprawdzania tokena
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
      const role = request.user.role;
      if (role !== 'ADMIN' && role !== 'RECEPTIONIST') {
        return reply.status(403).send({ error: 'Brak uprawnień' });
      }
    } catch (err) {
      reply.status(401).send({ error: 'Nieautoryzowany' });
    }
  });

  // Usuwanie rezerwacji (Przeniesione na górę)
  fastify.delete<{ Params: { id: string } }>('/admin/bookings/:id', async (request, reply) => {
    const { id } = request.params;
    console.log(`Próba usunięcia rezerwacji o ID: ${id}`);
    try {
      await prisma.booking.delete({
        where: { id }
      });
      console.log('Rezerwacja usunięta pomyślnie');
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Wystąpił błąd podczas przetwarzania żądania' });
    }
  });

  fastify.get('/admin/bookings', async (request, reply) => {
    const bookings = await prisma.booking.findMany({
      include: {
        roomType: true,
      },
      orderBy: {
        checkIn: 'asc',
      },
    });

    return bookings;
  });

  fastify.get('/admin/room-types', async (request, reply) => {
    const roomTypes = await prisma.roomType.findMany();
    return roomTypes;
  });

  // Dodawanie nowego typu pokoju
  fastify.post<{ Body: z.infer<typeof roomTypeSchema> }>('/admin/room-types', async (request, reply) => {
    try {
      const parsedBody = roomTypeSchema.parse(request.body);
      const { name, capacity, totalRooms, description, basePrice, images } = parsedBody;
      const roomType = await prisma.roomType.create({
        data: {
          name,
          capacity,
          totalRooms,
          description,
          basePrice,
          images: Array.isArray(images) ? JSON.stringify(images) : images
        }
      });
      return roomType;
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Wystąpił błąd podczas przetwarzania żądania' });
    }
  });

  // Aktualizacja typu pokoju
  fastify.put<{ Params: { id: string }, Body: z.infer<typeof roomTypeSchema> }>('/admin/room-types/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const parsedBody = roomTypeSchema.parse(request.body);
      const { name, capacity, totalRooms, description, basePrice, images } = parsedBody;
      const roomType = await prisma.roomType.update({
        where: { id },
        data: {
          name,
          capacity,
          totalRooms,
          description,
          basePrice,
          images: Array.isArray(images) ? JSON.stringify(images) : images
        }
      });
      return roomType;
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Wystąpił błąd podczas przetwarzania żądania' });
    }
  });

  // Usuwanie typu pokoju
  fastify.delete<{ Params: { id: string } }>('/admin/room-types/:id', async (request, reply) => {
    const { id } = request.params;
    console.log(`Próba usunięcia pokoju o ID: ${id}`);
    try {
      const deleted = await prisma.roomType.delete({
        where: { id }
      });
      console.log('Pokój usunięty pomyślnie:', deleted.name);
      return { success: true };
    } catch (err: any) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Wystąpił błąd podczas przetwarzania żądania' });
    }
  });

  fastify.get('/admin/stats', async (request, reply) => {
    const totalBookings = await prisma.booking.count();
    const roomsAggr = await prisma.roomType.aggregate({
      _sum: { totalRooms: true }
    });
    
    return {
      totalBookings,
      totalRooms: roomsAggr._sum.totalRooms || 0,
    };
  });

  // Aktualizacja statusu rezerwacji (Check-in / Check-out)
  fastify.patch<{ Params: { id: string }, Body: z.infer<typeof statusSchema> }>('/admin/bookings/:id/status', async (request, reply) => {
    const { id } = request.params;
    
    try {
      const { status } = statusSchema.parse(request.body);
      const booking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: { roomType: true }
      });
      return booking;
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Wystąpił błąd podczas przetwarzania żądania' });
    }
  });
}
