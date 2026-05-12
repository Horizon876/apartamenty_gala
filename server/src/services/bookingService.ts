import { CreateBookingInput } from '../schemas/bookingSchema';
import prisma from '../lib/db';
import { BadRequestError, ConflictError } from '../utils/errors';

export class BookingService {
  async createBooking(input: CreateBookingInput) {
    const { roomTypeId, checkIn, checkOut, guests, ...rest } = input;
    const startDate = checkIn;
    const endDate = checkOut;

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        // Transakcja z poziomem izolacji Serializable, aby zapobiec Race Condition
        return await prisma.$transaction(async (tx) => {
          const roomType = await tx.roomType.findUnique({
            where: { id: roomTypeId },
          });

          if (!roomType) {
            throw new BadRequestError('Wybrany typ pokoju nie istnieje');
          }

          // Capacity Check
          if (guests > roomType.capacity) {
            throw new BadRequestError('Liczba gości przekracza pojemność pokoju');
          }

          // Zignorowanie anulowanych rezerwacji
          const overlappingBookingsCount = await tx.booking.count({
            where: {
              roomTypeId: roomTypeId,
              status: { not: 'CANCELLED' },
              AND: [
                { checkIn: { lt: endDate } },
                { checkOut: { gt: startDate } },
              ],
            },
          });

          if (overlappingBookingsCount >= roomType.totalRooms) {
            throw new ConflictError('Brak dostępnych pokoi tego typu w wybranym terminie');
          }

          return await tx.booking.create({
            data: {
              ...rest,
              guests,
              roomTypeId,
              checkIn: startDate,
              checkOut: endDate,
            },
          });
        }, {
          isolationLevel: 'Serializable'
        });
      } catch (error: any) {
        if (error.code === 'P2034' || (error.message && error.message.includes('Serialization failure'))) {
          attempt++;
          if (attempt >= maxRetries) {
            throw new ConflictError('Nie udało się utworzyć rezerwacji z powodu konfliktu z inną transakcją. Spróbuj ponownie.');
          }
          // Backoff opóźnienie przed ponowieniem
          await new Promise(res => setTimeout(res, 100 * Math.pow(2, attempt)));
        } else {
          throw error;
        }
      }
    }
  }

  async getRoomTypes(guests?: number) {
    if (guests) {
      return await prisma.roomType.findMany({
        where: {
          capacity: {
            gte: guests
          }
        }
      });
    }
    return await prisma.roomType.findMany();
  }
}

export const bookingService = new BookingService();
