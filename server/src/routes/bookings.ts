import { FastifyInstance } from 'fastify';
import { CreateBookingSchema } from '../schemas/bookingSchema';
import { bookingService } from '../services/bookingService';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function bookingRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/room-types', async (request, reply) => {
    const roomTypes = await bookingService.getRoomTypes();
    return roomTypes;
  });

  server.post('/bookings', {
    schema: {
      body: CreateBookingSchema
    },
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 hour' // Mocny rate limit przeciwko atakom Denial of Inventory
      }
    }
  }, async (request, reply) => {
    // Nie ma już zagnieżdżonego try-catch, walidacja zachodzi automatycznie, błędy obsługuje global handler
    const booking = await bookingService.createBooking(request.body);

    return reply.code(201).send({
      message: 'Rezerwacja została utworzona pomyślnie',
      booking,
    });
  });
}
