import { FastifyInstance } from 'fastify';
import { CreateBookingSchema } from '../schemas/bookingSchema';
import { bookingService } from '../services/bookingService';

export async function bookingRoutes(fastify: FastifyInstance) {
  // Pobieranie dostępnych typów pokoi
  fastify.get('/room-types', async (request, reply) => {
    const roomTypes = await bookingService.getRoomTypes();
    return roomTypes;
  });

  // Tworzenie nowej rezerwacji
  fastify.post('/bookings', async (request, reply) => {
    try {
      // Walidacja danych wejściowych za pomocą Zod
      const validatedData = CreateBookingSchema.parse(request.body);

      const booking = await bookingService.createBooking(validatedData);

      return reply.code(201).send({
        message: 'Rezerwacja została utworzona pomyślnie',
        booking,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.code(400).send({
          error: 'Błąd walidacji',
          details: error.errors,
        });
      }

      if (error.message === 'Brak dostępnych pokoi tego typu w wybranym terminie') {
        return reply.code(409).send({ error: error.message });
      }

      fastify.log.error(error);
      return reply.code(500).send({ error: 'Wystąpił nieoczekiwany błąd serwera' });
    }
  });
}
