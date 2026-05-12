import { FastifyInstance } from 'fastify';
import { CreateBookingSchema } from '../schemas/bookingSchema';
import { bookingService } from '../services/bookingService';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function bookingRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/room-types', {
    schema: {
      querystring: z.object({
        guests: z.coerce.number().optional()
      })
    }
  }, async (request, reply) => {
    const { guests } = request.query as { guests?: number };
    const roomTypes = await bookingService.getRoomTypes(guests);
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
