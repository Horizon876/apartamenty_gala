import { PrismaClient } from '@prisma/client';
import { CreateBookingInput } from '../schemas/bookingSchema';

const prisma = new PrismaClient();

export class BookingService {
  async createBooking(input: CreateBookingInput) {
    const { roomTypeId, checkIn, checkOut, guests, ...rest } = input;
    const startDate = checkIn;
    const endDate = checkOut;

    // Transakcja z poziomem izolacji Serializable, aby zapobiec Race Condition
    return await prisma.$transaction(async (tx) => {
      const roomType = await tx.roomType.findUnique({
        where: { id: roomTypeId },
      });

      if (!roomType) {
        throw new Error('Wybrany typ pokoju nie istnieje');
      }

      // Capacity Check
      if (guests > roomType.capacity) {
        throw new Error('Liczba gości przekracza pojemność pokoju');
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
        throw new Error('Brak dostępnych pokoi tego typu w wybranym terminie');
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
