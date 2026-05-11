import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function adminRoutes(fastify: FastifyInstance) {
  // Middleware do sprawdzania tokena
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.method === 'OPTIONS') return;
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Usuwanie rezerwacji (Przeniesione na górę)
  fastify.delete('/admin/bookings/:id', async (request: any, reply) => {
    const { id } = request.params;
    console.log(`Próba usunięcia rezerwacji o ID: ${id}`);
    try {
      await prisma.booking.delete({
        where: { id }
      });
      console.log('Rezerwacja usunięta pomyślnie');
      return { success: true };
    } catch (err) {
      console.error('Błąd podczas usuwania rezerwacji:', err);
      reply.status(400).send({ error: 'Nie udało się usunąć rezerwacji' });
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
  fastify.post('/admin/room-types', async (request: any, reply) => {
    const { name, capacity, totalRooms, description, basePrice, images } = request.body;
    try {
      const roomType = await prisma.roomType.create({
        data: {
          name,
          capacity: parseInt(capacity),
          totalRooms: parseInt(totalRooms),
          description,
          basePrice: parseFloat(basePrice),
          images: Array.isArray(images) ? JSON.stringify(images) : images
        }
      });
      return roomType;
    } catch (err) {
      reply.status(400).send({ error: 'Nie udało się utworzyć typu pokoju' });
    }
  });

  // Aktualizacja typu pokoju
  fastify.put('/admin/room-types/:id', async (request: any, reply) => {
    const { id } = request.params;
    const { name, capacity, totalRooms, description, basePrice, images } = request.body;
    try {
      const roomType = await prisma.roomType.update({
        where: { id },
        data: {
          name,
          capacity: parseInt(capacity),
          totalRooms: parseInt(totalRooms),
          description,
          basePrice: parseFloat(basePrice),
          images: Array.isArray(images) ? JSON.stringify(images) : images
        }
      });
      return roomType;
    } catch (err) {
      reply.status(400).send({ error: 'Nie udało się zaktualizować typu pokoju' });
    }
  });

  // Usuwanie typu pokoju
  fastify.delete('/admin/room-types/:id', async (request: any, reply) => {
    const { id } = request.params;
    console.log(`Próba usunięcia pokoju o ID: ${id}`);
    try {
      const deleted = await prisma.roomType.delete({
        where: { id }
      });
      console.log('Pokój usunięty pomyślnie:', deleted.name);
      return { success: true };
    } catch (err: any) {
      console.error('Błąd podczas usuwania typu pokoju:', err);
      reply.status(400).send({ error: `Błąd serwera: ${err.message || 'Nieznany błąd'}` });
    }
  });

  fastify.get('/admin/stats', async (request, reply) => {
    const totalBookings = await prisma.booking.count();
    const rooms = await prisma.roomType.findMany();
    
    return {
      totalBookings,
      totalRooms: rooms.reduce((acc, r) => acc + r.totalRooms, 0),
    };
  });

  // Aktualizacja statusu rezerwacji (Check-in / Check-out)
  fastify.patch('/admin/bookings/:id/status', async (request: any, reply) => {
    const { id } = request.params;
    const { status } = request.body;
    
    try {
      const booking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: { roomType: true }
      });
      return booking;
    } catch (err) {
      reply.status(400).send({ error: 'Nie udało się zaktualizować statusu rezerwacji' });
    }
  });
}
